import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontFamily: 'Arial Black, Arial Bold, Gadget, sans-serif',
          fontWeight: 900,
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

export default PageHeader; 