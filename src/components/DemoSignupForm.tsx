import { Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import React, { useState } from 'react';

import datadog from '@/lib/datadog';

interface DemoSignupFormProps {
  onComplete: (data: { name: string; email: string }) => void;
}

const DemoSignupForm: React.FC<DemoSignupFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const validateName = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      // Log validation error
      datadog.log({
        action: 'validation_error',
        category: 'form',
        label: 'name_required',
        additionalData: { field: 'name' },
      });
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      // Log validation error
      datadog.log({
        action: 'validation_error',
        category: 'form',
        label: 'email_required',
        additionalData: { field: 'email' },
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      // Log validation error
      datadog.log({
        action: 'validation_error',
        category: 'form',
        label: 'email_invalid_format',
        additionalData: { field: 'email' },
      });
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();

    // Log form submission attempt
    datadog.log({
      action: 'form_submit_attempt',
      category: 'form',
      label: 'demo_signup',
      additionalData: {
        isNameValid,
        isEmailValid,
      },
    });

    if (isNameValid && isEmailValid) {
      setIsSubmitting(true);
      setFormError('');

      // Simulate API call
      setTimeout(() => {
        // Log successful signup
        datadog.logFormSubmit('demo_signup', {
          userEmail: email,
          userName: name,
        });

        onComplete({ name, email });
        setIsSubmitting(false);
      }, 800);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={validateName}
        error={!!nameError}
        helperText={nameError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '.MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={validateEmail}
        error={!!emailError}
        helperText={emailError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '.MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        sx={{
          py: 1.5,
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          },
        }}
        onClick={() => {
          // Log button click
          datadog.logButtonClick('signup_submit', {
            hasName: !!name.trim(),
            hasEmail: !!email.trim(),
          });
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Get Started'
        )}
      </Button>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        align="center"
        sx={{ mt: 2 }}
      >
        By signing up, you agree to our Terms of Service and Privacy Policy
      </Typography>
    </Box>
  );
};

export default DemoSignupForm;
