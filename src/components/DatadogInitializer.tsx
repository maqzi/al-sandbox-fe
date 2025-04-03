import React, { useEffect, useState } from 'react';
import datadog from '@/lib/datadog';

interface DatadogInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that ensures Datadog is initialized before rendering children
 * This should be placed high in the component tree
 */
const DatadogInitializer: React.FC<DatadogInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize datadog
    datadog.init();
    
    // Track app initialization
    datadog.trackSession('start', `session-${Date.now()}`);
    
    // Set user info from localStorage if available
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        datadog.setUser({
          id: user.id || user.userId,
          email: user.email,
          name: user.name || user.displayName,
          role: user.role
        });
      } catch (error) {
        console.error('Failed to parse user info for Datadog', error);
      }
    }
    
    // Initial page view tracking
    datadog.logPageView(
      window.location.pathname || 'home',
      {
        referrer: document.referrer,
        title: document.title
      }
    );
    
    // Track application version if available
    if (import.meta.env.APP_VERSION) {
      datadog.log({
        action: 'app_init',
        category: 'lifecycle',
        label: 'application_start',
        additionalData: {
          version: import.meta.env.APP_VERSION,
          environment: import.meta.env.MODE
        }
      });
    }
  
    setIsInitialized(true);
    
    // Cleanup on application unmount
    return () => {
      datadog.trackSession('end', `session-${Date.now()}`);
    };
  }, []);
  
  // We can render children immediately since Datadog initialization is non-blocking
  return <>{children}</>;
};

export default DatadogInitializer;
