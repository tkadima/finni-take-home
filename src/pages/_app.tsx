import * as React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
import AppNavBar from '@/app/components/navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFF',
    },
    secondary: {
      main: '#ED762F',
    },
    background: {
      default: '#FBF7F0',
    },
  },
  typography: {
    fontFamily: 'Switzer, sans-serif',
    h4: {
      fontFamily: 'Recklessneue, sans-serif',
    },
    h6: {
      fontFamily: 'Recklessneue, sans-serif',
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppNavBar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
