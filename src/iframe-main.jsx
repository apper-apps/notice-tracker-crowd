import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SendNotice from './components/pages/SendNotice';
import './index.css';

// Iframe-specific App component
const IframeApp = () => {
  return (
    <BrowserRouter>
      <div className="iframe-app">
        <SendNotice />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            fontSize: '14px',
            zIndex: 10000,
          }}
        />
      </div>
    </BrowserRouter>
  );
};

// Mount the iframe app
ReactDOM.createRoot(document.getElementById('root')).render(
  <IframeApp />
);

// Auto-resize functionality
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const height = entry.contentRect.height;
    window.parent.postMessage({
      type: 'RESIZE_IFRAME',
      height: Math.max(height, 600)
    }, '*');
  }
});

// Start observing the root element
setTimeout(() => {
  const root = document.getElementById('root');
  if (root) {
    resizeObserver.observe(root);
  }
}, 100);