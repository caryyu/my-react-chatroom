import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App'

document.addEventListener("DOMContentLoaded", function(_) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('react-cmp')
  );
})

