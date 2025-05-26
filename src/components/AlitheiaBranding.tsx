import React from 'react';
import { Box, Typography, SvgIcon } from '@mui/material';

interface AlitheiaLogoProps {
  variant?: 'default' | 'small' | 'large';
  color?: string;
  withTagline?: boolean;
  isHeader?: boolean;
}

const AlitheiaBranding: React.FC<AlitheiaLogoProps> = ({ 
  variant = 'default',
  color = 'primary',
  withTagline = false,
  isHeader = false
}) => {
  // Size mapping for different variants
  const sizeMap = {
    small: {
      iconSize: 18,
      fontSize: '1rem',
      taglineSize: '0.65rem',
      spacing: 0.75
    },
    default: {
      iconSize: 24,
      fontSize: '1.25rem',
      taglineSize: '0.75rem',
      spacing: 1
    },
    large: {
      iconSize: 32,
      fontSize: '1.75rem',
      taglineSize: '0.85rem',
      spacing: 1.5
    }
  };
  
  const { iconSize, fontSize, taglineSize, spacing } = sizeMap[variant];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isHeader ? 'flex-start' : 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: withTagline ? 0.5 : 0,
        }}
      >
        {/* Icon source: https://img.icons8.com/stencil/32/doctors-laboratory-coat.png colors = { #ffab00, #1976d2} */}
        <img
          src="/favicon.ico"
          alt="alitheia Labs"
          style={{
            width: iconSize,
            height: iconSize,
            marginRight: spacing * 8, 
            objectFit: 'contain',
          }}
        />
        <Typography
          variant={variant === 'large' ? 'h5' : variant === 'default' ? 'h6' : 'subtitle1'}
          sx={{
            fontWeight: 600,
            fontSize: fontSize,
            letterSpacing: '-0.02em',
            color: color === 'primary' ? 'primary.main' : color,
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          alitheia
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: color === 'primary' ? 'primary.dark' : color,
            }}
          >
            Labs
          </Box>
        </Typography>
      </Box>
      
      {withTagline && (
        <Typography
          variant="caption"
          sx={{
            fontSize: taglineSize,
            color: 'text.secondary',
            mt: -0.5,
            textAlign: isHeader ? 'left' : 'center',
            fontStyle: 'italic',
          }}
        >
          We build with you, as you build for your customers
        </Typography>
      )}
    </Box>
  );
};

export default AlitheiaBranding;
