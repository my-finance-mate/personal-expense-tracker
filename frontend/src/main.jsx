import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { BudgetProvider } from './components/BudgetContext'; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </React.StrictMode>
);
