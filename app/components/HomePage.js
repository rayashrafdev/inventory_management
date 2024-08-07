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
      padding={4}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Pantry Management App!
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        Let's add some items to your pantry.
      </Typography>
      <Box mt={3}>
        <Link href="/inventory" passHref>
          <Button variant="contained" color="primary" size="large" sx={{ m: 1 }}>
            GO TO INVENTORY
          </Button>
        </Link>
        <Link href="/camera" passHref>
          <Button variant="contained" color="secondary" size="large" sx={{ m: 1 }}>
            GO TO AI CAMERA
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default HomePage;
