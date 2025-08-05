import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // You might want to remove or customize this later
import App from './App';
// import reportWebVitals from './reportWebVitals'; // This line is now commented out or deleted

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(); // This line is now commented out or deleted