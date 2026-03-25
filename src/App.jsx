import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Files from './pages/Files';
import FileDetail from './pages/FileDetail';
import Movements from './pages/Movements';
import Profile from './pages/Profile';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUser({ email, name: email.split('@')[0].toUpperCase() });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<AddCustomer />} />
          <Route path="/files" element={<Files />} />
          <Route path="/files/:id" element={<FileDetail />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="*" element={<Navigate to="/customers" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
