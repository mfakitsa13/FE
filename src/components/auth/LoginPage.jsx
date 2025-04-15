import React, { useState } from 'react';
import {Container, Paper, Avatar, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LockPersonOutlinedIcon from "@mui/icons-material/LockPersonOutlined";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Συνάρτηση για το login
  const handleLogin = async (e) => {
    //Εμποδίζει το default submit behavior
    e.preventDefault();
    
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      // Κάνω αίτημα στον server για login
      const response = await axios.post('http://localhost:8080/api/auth/login', loginData);
      
      console.log("API Response:", response.data); // Ελέγχω την απάντηση του API
      localStorage.setItem('token', response.data.accessToken);
      console.log("Stored Token:", localStorage.getItem('token')); // Επιβεβαιώνω ότι αποθηκεύεται
      
      navigate('/dashboard');  // Μεταφορά στη σελίδα Dashboard
    } catch (error) {
      setError('Authentication failed. Try again!');
    }
  };

  return (
    <div>
        <div style={{ marginTop: '150px' }}>  
    <Container component="main" maxWidth="xs">
        <Paper elevation={10} sx={{ marginTop: { xs: 8, md: 18 }, padding: { xs: 3, md: 2 } }}>

    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{mx:"auto", bgcolor: "primary.main", textAlign: "center", mb: 1}}>
            <LockPersonOutlinedIcon/>
            </Avatar>

      <form onSubmit={handleLogin}>
        <TextField
          placeholder="Enter email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          placeholder="Enter password" 
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" fullWidth sx={{ marginTop: 3, py: 1.5 }}>
          Σύνδεση
        </Button>
      </form>
    </Box>
    </Paper>
  </Container>  
  </div>
  </div> 
    );
};

export default LoginPage;
