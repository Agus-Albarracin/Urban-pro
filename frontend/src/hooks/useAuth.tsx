import { useContext } from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';

export default function useAuth() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationProvider');
  }

  return context;
}
