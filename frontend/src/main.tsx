// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import './index.css';
import { warmUpServer, startKeepAlive } from './utils/keepAlive';

// Fire an immediate warm-up ping to prevent Render.com cold-start delays.
// Then start a repeating ping every 13 min so the server never sleeps
// while a user is actively on the site.
warmUpServer();
startKeepAlive();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
