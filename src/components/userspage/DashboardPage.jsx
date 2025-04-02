import React from 'react';
import { Container, Typography } from '@mui/material';

const DashboardPage = () => {

  return (
    <div>
      <div style={{ marginTop: '100px' }}>  {/* Ύψος της Navbar */}
    <Container component="main" maxWidth="md" sx={{ marginTop: 4, textAlign: 'center' }}>
      <Typography variant="h4">
        Καλώς ήρθες!
      </Typography>
    </Container>
    </div>
    </div>
  );
};

export default DashboardPage;