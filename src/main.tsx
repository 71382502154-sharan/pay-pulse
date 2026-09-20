import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initTouchLightEffect } from './utils/touchLightEffect';

// Initialize global button touch & click light brightening effect
initTouchLightEffect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

