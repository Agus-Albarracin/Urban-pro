import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthenticationContext } from './context/AuthenticationContext';

interface PrivateRouteProps {
  roles?: string[];
  element: React.ReactNode;
}

export function PrivateRoute({ element, roles }: PrivateRouteProps) {
  const authContext = useContext(AuthenticationContext);

  if (!authContext) {
    return null;
  }

  const { authenticatedUser } = authContext;

    if (!authenticatedUser) {
      return <Navigate to="/login" />;
    }
  
    if (roles && !roles.includes(authenticatedUser.role)) {
      return <Navigate to="/" />;
    }

  // Si está autenticado y tiene el rol adecuado, renderizar el componente
  return <>{element}</>;
}

interface AuthRouteProps {
  element: React.ReactNode;
}

export function AuthRoute({ element }: AuthRouteProps) {
  const authContext = useContext(AuthenticationContext);

  if (!authContext) {
    // Si el contexto es undefined, no se puede acceder a authenticatedUser
    return null;
  }

  const { authenticatedUser } = authContext;

  if (authenticatedUser?.role === 'user') {
    return <Navigate to="/home" />;
  }

  // Si ya está autenticado, redirigir a la página principal
  if (authenticatedUser?.role === 'admin' || authenticatedUser?.role === 'editor') {
    return <Navigate to="/dashboard" />;
  }

  // Si no está autenticado, renderizar el componente de login
  return <>{element}</>;
}
