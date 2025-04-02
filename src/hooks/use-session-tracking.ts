import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { trackActivity, setSessionId } from '@/store/userSlice';
import datadog from '@/lib/datadog';
import { TraceSpan } from '@datadog/browser-rum';

interface SessionTrackingOptions {
  featureName?: string;
  traceSteps?: boolean;
  captureScrollDepth?: boolean;
  captureMouseMovement?: boolean;
  mouseSamplingRate?: number; // 1 = every pixel, 10 = every 10 pixels
  mouseHeatmap?: boolean;
  scrollSamplingRate?: number; // milliseconds between scroll events
  inactivityThreshold?: number; // milliseconds before marking as inactive
}

/**
 * Hook for comprehensive session tracking and user activity monitoring
 * Combines features from use-tracking and use-activity-tracking with enhanced tracing
 */
export function useSessionTracking({
  featureName,
  traceSteps = true,
  captureScrollDepth = true,
  captureMouseMovement = false,
  mouseSamplingRate = 50,
  mouseHeatmap = false,
  scrollSamplingRate = 1000,
  inactivityThreshold = 300000 // 5 minutes
}: SessionTrackingOptions = {}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const sessionId = useSelector((state: RootState) => state.user.sessionId);
  const lastActivity = useSelector((state: RootState) => state.user.lastActivity);

  // State for current activity
  const [isActive, setIsActive] = useState(true);
  const [currentView, setCurrentView] = useState<string>(window.location.pathname);
  
  // Refs for tracking
  const featureSpanRef = useRef<TraceSpan | undefined>();
  const lastScrollDepth = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);
  const scrollTimeout = useRef<number | null>(null);
  const mouseTimeout = useRef<number | null>(null);
  const inactivityTimer = useRef<number | null>(null);
  const lastPosition = useRef<{ x: number, y: number } | null>(null);

  // Calculate page height
  const getScrollPercentage = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) || 0;
  };

  // Initialize session on mount
  useEffect(() => {
    const startTime = Date.now(); // Track component load time

    // Generate a unique session ID if we don't have one yet
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      dispatch(setSessionId(newSessionId));
      
      // Log session start with user information
      datadog.trackSession('start', newSessionId);

      datadog.log({
        action: 'session_start',
        category: 'session',
        label: newSessionId,
        additionalData: {
          timestamp: new Date().toISOString(),
          userInfo: userInfo || 'anonymous'
        }
      });
    }

    datadog.log({
      action: 'component_load',
      category: 'performance',
      label: 'useSessionTracking',
      additionalData: {
        loadTime: `${Date.now() - startTime}ms`,
        feature: featureName || 'none',
        sessionId: sessionId || 'unknown_session'
      }
    });

    // Track feature start if specified
    if (featureName) {
      const featureSpan = datadog.startTraceSpan('feature', featureName);
      featureSpanRef.current = featureSpan;
      
      datadog.trackFeatureEngagement(featureName, 'start');
      
      // Set as the current view context
      setCurrentView(featureName);
      datadog.setGlobalContext({ currentView: featureName });
    }
    
    // Reset activity tracking
    dispatch(trackActivity());
    
    return () => {
      // End feature tracking
      if (featureName) {
        const duration = Date.now() - (lastActivity || Date.now());
        
        if (featureSpanRef.current) {
          datadog.endTraceSpan(featureSpanRef.current, { 
            duration,
            maxScrollDepth: maxScrollDepth.current
          });
        }
        
        datadog.trackFeatureEngagement(featureName, 'end', duration);
      }
      
      // Send final scroll depth data
      if (captureScrollDepth && maxScrollDepth.current > 0) {
        datadog.log({
          action: 'max_scroll_depth',
          category: 'engagement',
          label: currentView,
          additionalData: {
            depth: maxScrollDepth.current,
            view: currentView,
            feature: featureName
          }
        });
      }
      
      // Clear any timers
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      if (mouseTimeout.current) window.clearTimeout(mouseTimeout.current);
      if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    };
  }, []);

  // Set up scroll tracking
  useEffect(() => {
    if (!captureScrollDepth) return;
    
    const handleScroll = () => {
      const depth = getScrollPercentage();
      lastScrollDepth.current = depth;
      
      // Update max depth if needed
      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
      }
      
      // Throttle logging
      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = window.setTimeout(() => {
        datadog.log({
          action: 'scroll_depth',
          category: 'engagement',
          label: currentView,
          additionalData: {
            depth,
            maxDepth: maxScrollDepth.current,
            view: currentView,
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
          }
        });
      }, scrollSamplingRate);
      
      // Record user activity
      dispatch(trackActivity());
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, [captureScrollDepth, currentView]);
  
  // Set up mouse movement tracking if enabled
  useEffect(() => {
    if (!captureMouseMovement) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Skip if we haven't moved enough based on sampling rate
      if (lastPosition.current && Math.abs(x - lastPosition.current.x) < mouseSamplingRate && 
          Math.abs(y - lastPosition.current.y) < mouseSamplingRate) {
        return;
      }
      
      // Update last position
      lastPosition.current = { x, y };
      
      // For heatmaps, send to Datadog RUM
      if (mouseHeatmap) {
        // Throttle logging
        if (mouseTimeout.current) {
          window.clearTimeout(mouseTimeout.current);
        }
        
        mouseTimeout.current = window.setTimeout(() => {
          datadog.trackMouseMovement(x, y, document.elementFromPoint(x, y)?.tagName);
        }, 100); // 10 times per second max
      }
      
      // Record user activity
      dispatch(trackActivity());
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeout.current) window.clearTimeout(mouseTimeout.current);
    };
  }, [captureMouseMovement, mouseHeatmap, mouseSamplingRate]);
  
  // Set up inactivity monitoring
  useEffect(() => {
    const checkActivity = () => {
      const now = Date.now();
      const timeSinceActivity = lastActivity ? now - lastActivity : 0;
      
      if (timeSinceActivity > inactivityThreshold) {
        if (isActive) {
          setIsActive(false);
          datadog.trackUserActivity('idle', timeSinceActivity);
          
          datadog.log({
            action: 'user_inactive',
            category: 'session',
            label: sessionId || 'unknown_session',
            additionalData: {
              inactiveTime: timeSinceActivity,
              threshold: inactivityThreshold,
              view: currentView
            }
          });
        }
      } else if (!isActive) {
        setIsActive(true);
        datadog.trackUserActivity('returned');
        
        datadog.log({
          action: 'user_active',
          category: 'session',
          label: sessionId || 'unknown_session'
        });
      }
      
      // Check again in 30 seconds
      inactivityTimer.current = window.setTimeout(checkActivity, 30000);
    };
    
    // Initial check
    checkActivity();
    
    return () => {
      if (inactivityTimer.current) {
        window.clearTimeout(inactivityTimer.current);
      }
    };
  }, [lastActivity, isActive, inactivityThreshold]);
  
  // Update user info in tracking context whenever it changes
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      datadog.setUser({
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        role: userInfo.role,
        plan: userInfo.plan
      });
      
      // If user has preferences, update them in Datadog
      if (userInfo.preferences) {
        datadog.updateUserPreferences(userInfo.preferences);
      }
    }
  }, [userInfo]);

  // Public methods for component usage
  
  // Track a UI interaction with tracing
  const trackInteraction = (actionType: string, name: string, details: Record<string, any> = {}) => {
    dispatch(trackActivity());
    
    if (traceSteps) {
      const interactionSpan = datadog.startTraceSpan('interaction', `${actionType}_${name}`);
      
      datadog.log({
        action: 'user_interaction',
        category: 'ui_interaction',
        label: name,
        additionalData: {
          type: actionType,
          view: currentView,
          feature: featureName,
          traceId: interactionSpan?.traceId,
          ...details
        }
      });
      
      if (interactionSpan) {
        datadog.endTraceSpan(interactionSpan, { status: 'ok', ...details });
      }
    } else {
      datadog.trackInteraction(actionType, name, {
        view: currentView,
        feature: featureName,
        ...details
      });
    }
  };
  
  // Track a workflow step completion
  const trackStep = (workflowName: string, stepName: string, stepNumber: number, isComplete: boolean = true, details: Record<string, any> = {}) => {
    dispatch(trackActivity());
    
    if (traceSteps) {
      const stepSpan = datadog.startTraceSpan('workflow_step', `${workflowName}_${stepName}`);
      
      datadog.trackWorkflowStep(workflowName, stepName, stepNumber, isComplete);
      
      if (stepSpan && isComplete) {
        datadog.endTraceSpan(stepSpan, { status: 'ok', ...details });
      }
    } else {
      datadog.trackWorkflowStep(workflowName, stepName, stepNumber, isComplete);
    }
  };
  
  // Track view change
  const trackViewChange = (viewName: string, viewData: Record<string, any> = {}) => {
    setCurrentView(viewName);
    dispatch(trackActivity());
    datadog.setGlobalContext({ currentView: viewName });
    
    const viewSpan = datadog.startTraceSpan('view_change', viewName);
    
    datadog.log({
      action: 'view_change',
      category: 'navigation',
      label: viewName,
      additionalData: {
        previousView: currentView,
        timestamp: new Date().toISOString(),
        traceId: viewSpan?.traceId,
        ...viewData
      }
    });
    
    if (viewSpan) {
      datadog.endTraceSpan(viewSpan, { status: 'ok', ...viewData });
    }
  };
  
  // Track error with tracing
  const trackError = (errorName: string, error: Error, details: Record<string, any> = {}) => {
    const errorSpan = datadog.startTraceSpan('error', errorName);
    
    datadog.logError(`${currentView}_error`, error, {
      feature: featureName,
      view: currentView,
      ...details
    });
    
    if (errorSpan) {
      datadog.endTraceSpan(errorSpan, { 
        status: 'error',
        errorName: error.name,
        errorMessage: error.message,
        ...details
      });
    }
  };
  
  // For forms
  const trackFormSubmit = (formName: string, formData: Record<string, any> = {}, success = true) => {
    dispatch(trackActivity());
    
    const formSpan = datadog.startTraceSpan('form_submit', formName);
    
    datadog.log({
      action: 'form_submit',
      category: 'form',
      label: formName,
      additionalData: {
        success,
        view: currentView,
        feature: featureName,
        traceId: formSpan?.traceId,
        timestamp: new Date().toISOString(),
        // Don't log sensitive form values, just field names
        fields: Object.keys(formData)
      }
    });
    
    if (formSpan) {
      datadog.endTraceSpan(formSpan, { 
        status: success ? 'ok' : 'error',
        fields: Object.keys(formData).length
      });
    }
  };
  
  return {
    isActive,
    sessionId,
    currentView,
    trackInteraction,
    trackStep,
    trackViewChange,
    trackError,
    trackFormSubmit,
    scrollDepth: lastScrollDepth.current,
    maxScrollDepth: maxScrollDepth.current
  };
}

export default useSessionTracking;