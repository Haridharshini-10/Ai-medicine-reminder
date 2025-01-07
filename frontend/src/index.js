// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this is correct
import App from './App';

// Ensure 'root' element is found in your HTML
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create root
  root.render(<App />); // Render the App component
} else {
  console.error('Root element not found!');
}
