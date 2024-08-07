import * as React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
import AppNavBar from '@/app/components/navbar';
import { AuthProvider } from '@/app/context/AuthContext';
import Head from 'next/head';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ED762F',
    },
    secondary: {
      main: '#FFF',
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
    h5: {
      fontFamily: 'Recklessneue, sans-serif',
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Finni Health Patient Manager</title>
      </Head>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppNavBar />
          <Component {...pageProps} />
        </ThemeProvider>
    </AuthProvider>
    </>
  );
}
