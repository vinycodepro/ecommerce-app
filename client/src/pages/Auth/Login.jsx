// client/src/pages/Auth/Login.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/Auth/LoginForm';
import Loading from '../Shared/Loading';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <Loading />;
  }

  return <LoginForm />;
};

export default Login;