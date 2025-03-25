import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setStep } from '@/store/userSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
  step: number;
}

const PrivateRoute = ({ children, step }: PrivateRouteProps) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setStep(step));
    // Save the current route to local storage
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [dispatch, step, location.pathname]);

  if (!user.name || !user.email) {
    return <Navigate to="/signup" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;