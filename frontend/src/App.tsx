import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Contents from './pages/Contents';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import User from './pages/User';
import HomeUser from './pages/HomeUser';
import Calendary from './pages/Calendary'

import { AuthRoute, PrivateRoute } from './Route';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      console.log(authResponse);
      setAuthenticatedUser(authResponse.user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, [authenticatedUser]);

  return isLoaded ? (
    <Router>
      <Routes>
      <Route 
  path="/" 
  element={
    authenticatedUser ? (
      authenticatedUser.role === 'user' ? <Navigate to="/home" /> : <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    )
  } 
/>
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['admin', 'editor']} element={<Dashboard />} />
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute element={<User />} />
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute element={<HomeUser />} />
          }
        />
        
        <Route
          path="/calendary"
          element={
            <PrivateRoute element={<Calendary />} />
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute roles={['admin']} element={<Users />} />
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute element={<Courses />} />
          }
        />
        <Route
          path="/courses/:id"
          element={
            <PrivateRoute element={<Contents />} />
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute element={<Login />} />
          }
        />
      </Routes>
    </Router>
  ) : null;
}
