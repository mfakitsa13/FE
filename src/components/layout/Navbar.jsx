import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Logout } from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setMobileOpen(false);
  };

  const menuItems = [
    { text: "ΑΡΧΙΚΗ", path: "/dashboard" },
    { text: "ΣΧΟΛΕΣ ΟΔΗΓΩΝ", path: "/driving-schools" },
    { text: "ΜΑΘΗΤΕΣ", path: "/students" },
  ];

  // Αν η σελίδα είναι "/" ή "/login", εμφάνισε μόνο το κεντρικό κείμενο
  if (location.pathname === "/" || location.pathname === "/login") {
    return (
      <AppBar position="fixed" >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Driving School System
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="fixed" >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Driving School System
        </Typography>

        
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
          <List sx={{ width: 250 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <Logout sx={{ marginRight: 1 }} />
                <ListItemText primary="Αποσύνδεση" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;