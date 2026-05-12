// main.jsx
// App entry point.
// Wraps the app in BrowserRouter for client-side routing.
// Adds the react-hot-toast Toaster so any component can call toast() globally.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Toaster renders toast notifications — positioned bottom-right */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#161B22',
            color: '#E6EDF3',
            border: '1px solid #21262D',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00C896', secondary: '#161B22' } },
          error:   { iconTheme: { primary: '#FF453A', secondary: '#161B22' } },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
