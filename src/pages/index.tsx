import { useState } from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import useFetch from '../hooks/useFetch';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import PatientModal from '../app/components/PatientModal';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteWarningDialog from '../app/components/DeleteWarningDialog';

const generateGridColDef = (
  handleDeleteClick: (id: number) => void,
  handleEditClick: (id: number) => void
): GridColDef[] => {
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
      renderCell: (params) => {
        const { first_name, middle_name, last_name } =
          params.row as PatientData;
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
        return addresses.map((address) => `${address.addressLine1}`).join(', ');
      },
    },
    {
      field: 'additional_fields',
      headerName: 'Additional Fields',
      width: 300,
      renderCell: (params) => {
        const additionalFields = JSON.parse(params.value);
        return Object.keys(additionalFields)
          .map((key: string) => `${key}: ${additionalFields[key]}`)
          .join(', ');
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      renderCell: (params) => {
        const { id } = params;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id as number)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id as number)}
            color="inherit"
          />,
        ];
      },
    },
  ];
};

const PatientDataView = () => {
  const { data, isLoading, isError } = useFetch('/api/patients');
  const [patientModalIsOpen, setPatientModalIsOpen] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  const theme = useTheme();

  const handleOpenNewPatientModal = () => {
    setPatientModalIsOpen(true);
  };

  const handleEditClick = (id: number) => {
    const patient = data.find((patient: PatientData) => patient.id === id);
    setSelectedPatient(patient);
    setPatientModalIsOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    const patient = data.find((patient: PatientData) => patient.id === id);
    setSelectedPatient(patient);
    setWarningDialogIsOpen(true);
    // delete the patient with this id
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Container sx={{ padding: '50px' }}>
      {patientModalIsOpen && (
        <PatientModal
          isOpen={patientModalIsOpen}
          onCloseModal={() => setPatientModalIsOpen(false)}
          patient={selectedPatient ?? null}
        />
      )}
      {warningDialogIsOpen && selectedPatient && (
        <DeleteWarningDialog
          isOpen={warningDialogIsOpen}
          onCloseModal={() => setWarningDialogIsOpen(false)}
          patient={selectedPatient}
        />
      )}
      <Typography variant="h4" sx={{ paddingBottom: '20px' }}>
        Patient Data
      </Typography>
      <Button onClick={handleOpenNewPatientModal}>Add a new Patient</Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{
            backgroundColor: theme.palette.common.white,
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: theme.palette.common.white,
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
            },
          }}
          columns={generateGridColDef(handleDeleteClick, handleEditClick)}
          rows={data}
        />
      </Box>
    </Container>
  );
};

export default PatientDataView;
