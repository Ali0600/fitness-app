import { useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};

export const useAppLoading = () => {
  const { isLoading, error } = useAppState();
  return { isLoading, error, hasError: !!error };
};
