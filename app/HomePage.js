import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const HomePage = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Pantry Management App!
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Let's add some items to your pantry.
      </Typography>
      <Link href="/inventory">
        <Button variant="contained" color="primary" size="large">
          Go to Inventory
        </Button>
      </Link>
    </Box>
  );
};

export default HomePage;
