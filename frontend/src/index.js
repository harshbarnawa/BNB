import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ServicesPage from './ServicesPage';
import ServiceDetailPage from './ServiceDetailPage';
import AdminLeadsPage from './AdminLeadsPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category" element={<ServiceDetailPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
