import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';
import { createContext, useContext } from 'react';

// Define types for logging
interface LoggerOptions {
  action: string;
  category?: string;
  label?: string;
  additionalData?: Record<string, any>;
}

// Buffer to store logs before initialization
type BufferedLog = {
  type: 'log' | 'error';
  args: any[];
  timestamp: number;
};

class DatadogService {
  private initialized = false;
  private initializing = false;
  private userInfo: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  } = {};
  private logBuffer: BufferedLog[] = [];
  private bufferSize = 100; // Maximum logs to buffer before dropping

  /**
   * Initialize Datadog logging and RUM
   */
  init(): boolean {
    if (this.initialized) return true;
    if (this.initializing) return false;
    
    this.initializing = true;
    console.log('Initializing Datadog...');
    
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.warn('Datadog initialization skipped - not in browser environment');
        return false;
      }
      
      // Check if env variables are available
      const clientToken = import.meta.env.VITE_DATADOG_CLIENT_TOKEN;
      const appId = import.meta.env.VITE_DATADOG_APPLICATION_ID;
      const site = import.meta.env.VITE_DATADOG_SITE || 'us.datadoghq.com';

      if (!clientToken) {
        console.warn('Datadog initialization skipped - missing client token');
        this.initializing = false;
        return false;
      }

      // Initialize Datadog logs
      console.log('Initializing Datadog logs...');
      datadogLogs.init({
        clientToken: clientToken,
        site: site,
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
        service: import.meta.env.VITE_DATADOG_SERVICE || 'alitheia-labs-ui',
        env: import.meta.env.MODE || 'development'
      });

      // Initialize RUM if app ID is available
      if (appId) {
        console.log('Initializing Datadog RUM...');
        datadogRum.init({
          applicationId: appId,
          clientToken: clientToken,
          site: site,
          service: import.meta.env.VITE_DATADOG_SERVICE || 'alitheia-labs-ui',
          env: import.meta.env.MODE || 'development',
          sessionSampleRate: 100,
          sessionReplaySampleRate: 20,
          trackUserInteractions: true,
          trackResources: true,
          trackLongTasks: true
        });
      } else {
        console.warn('Datadog RUM initialization skipped - missing application ID');
      }

      this.initialized = true;
      this.initializing = false;
      console.log('Datadog initialized successfully');
      
      // Process any buffered logs
      this.flushLogBuffer();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Datadog:', error);
      this.initializing = false;
      return false;
    }
  }

  /**
   * Check if Datadog is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Buffer a log for later processing
   */
  private bufferLog(type: 'log' | 'error', args: any[]): void {
    // Keep buffer size under control by removing oldest entry if necessary
    if (this.logBuffer.length >= this.bufferSize) {
      this.logBuffer.shift();
    }
    
    this.logBuffer.push({
      type,
      args,
      timestamp: Date.now()
    });
  }
  
  /**
   * Process any logs that were queued before initialization
   */
  private flushLogBuffer(): void {
    if (!this.initialized) return;
    
    console.log(`Processing ${this.logBuffer.length} buffered logs`);
    
    this.logBuffer.forEach(item => {
      if (item.type === 'log') {
        this.processLog(...item.args);
      } else if (item.type === 'error') {
        this.processError(...item.args);
      }
    });
    
    // Clear the buffer
    this.logBuffer = [];
  }

  /**
   * Set user information for logging
   */
  setUser(userInfo: { id?: string; email?: string; name?: string; role?: string }): void {
    this.userInfo = { ...this.userInfo, ...userInfo };
    
    if (this.initialized) {
      try {
        datadogLogs.setUser(this.userInfo);
        datadogRum.setUser(this.userInfo);
      } catch (error) {
        console.error('Failed to set user in Datadog:', error);
      }
    }
  }

  /**
   * Process log after initialization
   */
  private processLog(options: LoggerOptions): void {
    try {
      datadogLogs.logger.info('User Action', {
        action: options.action,
        category: options.category,
        label: options.label,
        ...options.additionalData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log to Datadog:', error);
    }
  }
  
  /**
   * Process error after initialization
   */
  private processError(message: string, error: Error, additionalData = {}): void {
    try {
      datadogLogs.logger.error(message, {
        error: {
          kind: error.name,
          message: error.message,
          stack: error.stack
        },
        ...additionalData,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log error to Datadog:', logError);
    }
  }

  /**
   * Log an event to Datadog or buffer it if not initialized
   */
  log(options: LoggerOptions): void {
    if (!this.initialized) {
      this.bufferLog('log', [options]);
      return;
    }

    this.processLog(options);
  }

  /**
   * Log an error to Datadog or buffer it if not initialized
   */
  logError(message: string, error: Error, additionalData = {}): void {
    if (!this.initialized) {
      this.bufferLog('error', [message, error, additionalData]);
      return;
    }

    this.processError(message, error, additionalData);
  }

  /**
   * Log a page view to Datadog
   */
  logPageView(pageName: string, pageData = {}): void {
    this.log({
      action: 'page_view',
      category: 'navigation',
      label: pageName,
      additionalData: {
        page: pageName,
        ...pageData,
        url: window.location.pathname,
        referrer: document.referrer || 'direct'
      }
    });
  }

  /**
   * Log a button click to Datadog
   */
  logButtonClick(buttonName: string, buttonData = {}): void {
    this.log({
      action: 'button_click',
      category: 'ui_interaction',
      label: buttonName,
      additionalData: buttonData
    });
  }

  /**
   * Log a form submission to Datadog
   */
  logFormSubmit(formName: string, formData = {}, success = true): void {
    this.log({
      action: 'form_submit',
      category: 'form',
      label: formName,
      additionalData: {
        success,
        ...formData
      }
    });
  }

  /**
   * Log form validation errors to Datadog
   */
  logFormError(formName: string, errors: Record<string, any>): void {
    this.log({
      action: 'form_error',
      category: 'form',
      label: formName,
      additionalData: {
        fields: Object.keys(errors),
        errorCount: Object.keys(errors).length,
        errors
      }
    });
  }

  /**
   * Log API requests to Datadog with enhanced metadata
   */
  logApiRequest(endpoint: string, method: string, status: number, duration: number): void {
    this.log({
      action: 'api_request',
      category: 'api',
      label: `${method} ${endpoint}`,
      additionalData: {
        endpoint,
        method,
        status,
        duration,
        success: status >= 200 && status < 300,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.innerWidth}x${window.innerHeight}`
      }
    });
  }

  /**
   * Log feature usage with additional context
   */
  logFeatureUsage(featureName: string, featureData = {}): void {
    this.log({
      action: 'feature_usage',
      category: 'feature',
      label: featureName,
      additionalData: {
        ...featureData,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        referrer: document.referrer || 'direct'
      }
    });
  }

  /**
   * Track user interaction with any element
   */
  trackInteraction(elementType: string, elementName: string, additionalData = {}): void {
    this.log({
      action: 'user_interaction',
      category: 'ui_interaction',
      label: `${elementType}_${elementName}`,
      additionalData: {
        elementType,
        elementName,
        ...additionalData
      }
    });
  }

  /**
   * Track component mount/unmount lifecycle
   */
  trackComponentLifecycle(componentName: string, action: 'mount' | 'unmount', duration?: number): void {
    this.log({
      action: `component_${action}`,
      category: 'lifecycle',
      label: componentName,
      additionalData: {
        duration,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track search actions
   */
  trackSearch(searchTerm: string, category: string, resultsCount: number): void {
    this.log({
      action: 'search',
      category,
      label: searchTerm,
      additionalData: {
        searchTerm,
        resultsCount,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track file operations
   */
  trackFileOperation(operation: 'upload' | 'download' | 'view', fileType: string, fileSize?: number, fileName?: string): void {
    this.log({
      action: `file_${operation}`,
      category: 'file_operation',
      label: fileType,
      additionalData: {
        fileType,
        fileSize,
        fileName,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track application performance metrics
   */
  trackPerformance(metricName: string, value: number, unit: string): void {
    this.log({
      action: 'performance',
      category: 'metrics',
      label: metricName,
      additionalData: {
        value,
        unit,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track state changes
   */
  trackStateChange(stateName: string, previousValue: any, currentValue: any, source?: string): void {
    this.log({
      action: 'state_change',
      category: 'state',
      label: stateName,
      additionalData: {
        previousValue: typeof previousValue === 'object' ? JSON.stringify(previousValue) : previousValue,
        currentValue: typeof currentValue === 'object' ? JSON.stringify(currentValue) : currentValue,
        source,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track user workflow steps
   */
  trackWorkflowStep(workflowName: string, stepName: string, stepNumber: number, isComplete: boolean): void {
    this.log({
      action: 'workflow_step',
      category: 'workflow',
      label: `${workflowName}_${stepName}`,
      additionalData: {
        workflowName,
        stepName,
        stepNumber,
        isComplete,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track session information
   */
  trackSession(action: 'start' | 'end' | 'refresh', sessionId: string, duration?: number): void {
    this.log({
      action: `session_${action}`,
      category: 'session',
      label: sessionId,
      additionalData: {
        sessionId,
        duration,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Track authentication events
   */
  trackAuth(action: 'login' | 'logout' | 'login_attempt' | 'password_reset', success: boolean, method?: string): void {
    this.log({
      action: `auth_${action}`,
      category: 'authentication',
      label: success ? 'success' : 'failure',
      additionalData: {
        method,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Create a singleton instance
const datadog = new DatadogService();

// Create a React context for Datadog
export const DatadogContext = createContext(datadog);

// Hook for using Datadog in React components
export const useDatadog = () => useContext(DatadogContext);

// Export the singleton by default
export default datadog;