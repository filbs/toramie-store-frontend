import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout and Global Components
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

// Pages
import CalculatorPage from './pages/CalculatorPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import Orders from './pages/Orders';

function App() {
// Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("userAuth");

  return (
    <Router>
      <Routes>
        {/* PUBLIC: Anyone can see the calculator at http://localhost:5173/ */}
        <Route path="/" element={<CalculatorPage isAdmin={false} />} />
        
        {/* LOGIN: http://localhost:5173/login */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN SECTION: Wrapped in Layout to show Sidebar + TopHeader */}
        <Route element={isLoggedIn ? <Layout /> : <Navigate to= "/login" />}>
          <Route path="/admin/calculator" element={<CalculatorPage isAdmin={true} />} />
          <Route path="/admin" element={<AdminSettingsPage />} />
          <Route path="/admin/orders" element={<Orders />} />
        </Route>

        {/* FALLBACK: Redirect errors to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;