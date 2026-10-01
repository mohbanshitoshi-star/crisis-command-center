import React from 'react';
import { User, authService } from '../../services/authService';
import { AuthPage } from './AuthPage';

interface Props {
  user: User | null;
  onAuthSuccess: (user: User) => void;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ user, onAuthSuccess, children }) => {
  if (!user || !authService.isAuthenticated()) {
    return <AuthPage onAuthSuccess={onAuthSuccess} />;
  }

  return <>{children}</>;
};
