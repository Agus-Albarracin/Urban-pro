import { createContext, Dispatch, SetStateAction, useState, ReactNode } from 'react';
import User from '../models/user/User';

interface AuthContextValue {
  authenticatedUser: User | null;
  setAuthenticatedUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthenticationContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthenticationProviderProps {
  children: ReactNode;
}

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  return (
    <AuthenticationContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
}