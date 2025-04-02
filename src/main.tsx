import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DatadogInitializer from './components/DatadogInitializer';
import './index.css';

// Initialize Datadog as early as possible
import datadog from './lib/datadog';
datadog.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatadogInitializer>
      <App />
    </DatadogInitializer>
  </React.StrictMode>,
);
