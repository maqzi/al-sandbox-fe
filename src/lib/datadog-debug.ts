import datadog from './datadog';

/**
 * Debug utility to check Datadog status and troubleshoot initialization issues
 */
export const checkDatadogStatus = () => {
  // Check if datadog is initialized
  const isInitialized = datadog.isInitialized();

  // Check for environment variables
  const clientToken = import.meta.env.DATADOG_CLIENT_TOKEN;
  const appId = import.meta.env.DATADOG_APPLICATION_ID;
  const site = import.meta.env.DATADOG_SITE;

  console.group('Datadog Status');
  console.log('Initialized:', isInitialized);
  console.log('Client Token Available:', !!clientToken);
  console.log('Application ID Available:', !!appId);
  console.log('Datadog Site:', site || 'us5.datadoghq.com (default)');
  console.log('Environment:', import.meta.env.MODE || 'development');
  console.groupEnd();

  // Try to force initialize if not already initialized
  if (!isInitialized) {
    console.log('Attempting to initialize Datadog...');
    const success = datadog.init();
    console.log('Initialization attempt result:', success);
  }

  return {
    isInitialized,
    clientTokenAvailable: !!clientToken,
    appIdAvailable: !!appId,
    site: site || 'us5.datadoghq.com (default)',
    environment: import.meta.env.MODE || 'development',
  };
};

/**
 * Send a test log to verify Datadog is working
 */
export const sendTestLog = (message = 'Test log message') => {
  datadog.log({
    action: 'test_log',
    category: 'debug',
    label: message,
    additionalData: {
      timestamp: new Date().toISOString(),
      testId: `test-${Date.now()}`,
    },
  });

  console.log('Test log sent to Datadog');
};

export default { checkDatadogStatus, sendTestLog };
