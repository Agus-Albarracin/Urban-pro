import './index.css'

import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import App from './App'
import { AuthenticationProvider } from './context/AuthenticationContext';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement); 

root.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthenticationProvider>
  </React.StrictMode>
);

reportWebVitals();
