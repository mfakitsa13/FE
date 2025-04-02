import { Box } from "@mui/material";
import React from "react";

const FooterComponent = () => {
  return (
    <Box
      sx={{
        bgcolor: "#7095be",
        color: "#ffffff",
        padding: "20px",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        width: "100%",
        left: 0
      }}
    >
      Maria Fakitsa | All Rights Reserved &copy; {new Date().getFullYear()}
    </Box>
  );
};

export default FooterComponent;