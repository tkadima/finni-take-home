import { AppBar, Box, IconButton, Link, Toolbar, Typography } from "@mui/material";

export default function AppNavBar() { 
    return  <AppBar position="static">
    <Toolbar>
      <Box sx={{ flexGrow: 1 }}>
        <IconButton edge="start" color="inherit" aria-label="logo" href="/">
          <img src="/Logo.svg" alt="Logo" style={{ height: 40 }} />
        </IconButton>
      </Box>
      <Typography variant="h6">
        <Link href="/logout" color="inherit" underline="none">
          Logout
        </Link>
      </Typography>
    </Toolbar>
  </AppBar>
}