// pages/index.tsx
import * as React from 'react';
import { Container, Typography } from '@mui/material';
import useFetch from '../hooks/useFetch';

const HomePage = () => {
  const { data, isLoading, isError } = useFetch('/api/sample');

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Container>
      <Typography variant="h4">Home Page</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
};

export default HomePage;
