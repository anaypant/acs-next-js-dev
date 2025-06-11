"use client";

import { Box, Container, ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a5a2f',
    },
    secondary: {
      main: '#157a42',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

interface SignupLayoutProps {
  children: React.ReactNode;
}

export function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          background: "linear-gradient(to bottom, #f0f9f4, #e6f5ec, #d8eee1)",
          minHeight: "100vh",
          py: { xs: 4, sm: 6, md: 8 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
} 