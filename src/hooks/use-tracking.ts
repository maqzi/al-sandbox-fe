import { useEffect, useRef } from 'react';

import datadog from '@/lib/datadog';

interface UseTrackingOptions {
  componentName: string;
  trackMount?: boolean;
  trackUnmount?: boolean;
  trackProps?: boolean;
  trackRenders?: boolean;
  additionalData?: Record<string, any>;
}

/**
 * Hook for easy tracking of component lifecycle and interactions
 */
export function useTracking({
  componentName,
  trackMount = true,
  trackUnmount = true,
  trackProps = false,
  trackRenders = false,
  additionalData = {},
}: UseTrackingOptions) {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  const prevProps = useRef<Record<string, any>>({});

  // Track component mount
  useEffect(() => {
    if (trackMount) {
      // Ensure Datadog is initialized first
      if (!datadog.isInitialized()) {
        datadog.init();
      }

      datadog.trackComponentLifecycle(componentName, 'mount');

      datadog.log({
        action: 'component_mount',
        category: 'lifecycle',
        label: componentName,
        additionalData: {
          ...additionalData,
          url: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Track component unmount and duration
    return () => {
      if (trackUnmount) {
        const duration = Date.now() - mountTime.current;
        datadog.trackComponentLifecycle(componentName, 'unmount', duration);

        datadog.log({
          action: 'component_unmount',
          category: 'lifecycle',
          label: componentName,
          additionalData: {
            ...additionalData,
            duration,
            renderCount: renderCount.current,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        });
      }
    };
  }, [componentName, trackMount, trackUnmount]);

  // Track renders
  useEffect(() => {
    if (trackRenders) {
      renderCount.current += 1;

      if (renderCount.current > 1) {
        // Skip initial render
        datadog.log({
          action: 'component_render',
          category: 'lifecycle',
          label: componentName,
          additionalData: {
            renderCount: renderCount.current,
            ...additionalData,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  });

  // Track props changes
  const trackPropsChange = (props: Record<string, any>) => {
    if (!trackProps) return;

    const changedProps: Record<string, { previous: any; current: any }> = {};
    let hasChanges = false;

    Object.entries(props).forEach(([key, value]) => {
      if (prevProps.current[key] !== value) {
        changedProps[key] = {
          previous: prevProps.current[key],
          current: value,
        };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      datadog.log({
        action: 'props_change',
        category: 'state',
        label: componentName,
        additionalData: {
          changedProps,
          ...additionalData,
          timestamp: new Date().toISOString(),
        },
      });
    }

    prevProps.current = { ...props };
  };

  // Tracking event helpers
  const trackClick = (elementName: string, data = {}) => {
    datadog.trackInteraction('click', elementName, {
      componentName,
      ...data,
      timestamp: new Date().toISOString(),
    });
  };

  const trackInput = (inputName: string, inputType: string, data = {}) => {
    datadog.trackInteraction('input', inputName, {
      componentName,
      inputType,
      ...data,
      timestamp: new Date().toISOString(),
    });
  };

  const trackSubmit = (formName: string, data = {}) => {
    datadog.log({
      action: 'form_submit',
      category: 'form',
      label: formName,
      additionalData: {
        componentName,
        ...data,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const trackError = (errorName: string, error: Error, data = {}) => {
    datadog.logError(`${componentName}_error`, error, {
      errorName,
      componentName,
      ...data,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    });
  };

  return {
    trackPropsChange,
    trackClick,
    trackInput,
    trackSubmit,
    trackError,
    renderCount: renderCount.current,
  };
}
