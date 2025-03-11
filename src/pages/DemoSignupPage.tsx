import React from 'react';
import Layout from '@/components/Layout';
import DemoSignupForm from '@/components/DemoSignupForm';
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/userSlice"

const DemoSignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSignupComplete = (data: { name: string; email: string }) => {
    dispatch(setUser(data));
    console.log('Signup complete:', data);
    navigate('/index');
  };

  return (
      <DemoSignupForm onComplete={handleSignupComplete} />
  );
};

export default DemoSignupPage;