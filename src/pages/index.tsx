import * as React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import useFetch from '../hooks/useFetch';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const generateGridColDef = (): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
      renderCell: (params) => {
        const { first_name, middle_name, last_name } = params.row as UserData;
        return `${last_name}, ${first_name} ${middle_name}`;
      },
    },
    { field: 'date_of_birth', headerName: 'Date of Birth', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'addresses',
      headerName: 'Addresses',
      width: 300,
      renderCell: (params) => {
        const addresses: Address[] = JSON.parse(params.value);
        return addresses
          .map((address) => `${address.type}: ${address.address}`)
          .join(', ');
      },
    },
    {
      field: 'additional_fields',
      headerName: 'Additional Fields',
      width: 300,
      renderCell: (params) => {
        const additionalFields: AdditionalField[] = JSON.parse(params.value);
        return additionalFields
          .map((field) => `${field.field_name}: ${field.field_value}`)
          .join(', ');
      },
    },
  ];
};

const PatientDataView = () => {
  const { data, isLoading, isError } = useFetch('/api/patients');
  const theme = useTheme();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Container sx={{ padding: '50px' }}>
      <Typography variant="h4" sx={{ padding: '20px' }}>
        Patient Data
      </Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{
            backgroundColor: theme.palette.common.white,
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.common.white,
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.common.white,
            },
          }}
          columns={generateGridColDef()}
          rows={data}
        />
      </Box>
    </Container>
  );
};

export default PatientDataView;
