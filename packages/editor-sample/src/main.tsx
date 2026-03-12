import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import THEME from './theme';

function Root() {
  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.action === 'setTheme') {
        const d = e.data;
        const r = document.documentElement;
        r.style.setProperty('--crm-surface', d.surface);
        r.style.setProperty('--crm-bg',      d.bg);
        r.style.setProperty('--crm-border',  d.border);
        r.style.setProperty('--crm-text-1',  d.text1);
        r.style.setProperty('--crm-text-2',  d.text2);
        r.style.setProperty('--crm-text-3',  d.text3);
      }
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: 'emailBuilderReady' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);