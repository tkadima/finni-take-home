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
      {
        data.map((row:any) => <div>
            <div>id: {row.id}</div>
            <div>name: { `${row.last_name}, ${row.first_name} ${row.middle_name}`}</div>
        </div>)
      }
    </Container>
  );
};

export default HomePage;
