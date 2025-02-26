import React from 'react';
import { Typography, Button } from '@mui/material';

const WelcomePage = ({ userInfo, handleLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo.name}!
      </Typography>
      <Typography variant="body1" gutterBottom>
        You have successfully logged in.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default WelcomePage;