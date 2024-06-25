import { useState } from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import useFetch from '../hooks/useFetch';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
} from '@mui/x-data-grid';
import PatientModal from '../app/components/PatientModal';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteWarningDialog from '../app/components/DeleteWarningDialog';
import MutationSnackbar from '../app/components/MutationSnackbar';

const generateGridColDef = (
  handleDeleteClick: (id: number) => void,
  handleEditClick: (id: number) => void,
  additionalFields?: string[]
): GridColDef[] => {
  let configuredColumns: GridColDef[] = [];
  if (additionalFields)
    configuredColumns = additionalFields?.map(
      (field) => ({ field, headerName: field, width: 200 }) as GridColDef
    );
  return [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'full_name',
      headerName: 'Full Name',
      width: 200,
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
          .map(
            (address) =>
              `${address.addressLine1} ${address.city}, ${address.state}`
          )
          .join(', ');
      },
    },
    {
      field: 'phone_numbers', 
      headerName: 'Phone Numbers', 
      width: 200,
      renderCell: (params) => {
        const phoneNumbers: string[] = JSON.parse(params.value); 
        return phoneNumbers.map(phone => phone).join(', ');
      }
    },
    ...configuredColumns,
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
  const { data, isLoading, isError, post, put, del } =
    useFetch('/api/patients');

  const rows = data?.map((patient: PatientData) => {
    console.log('patient', patient); 
    const additionalFields = JSON.parse(patient.additional_fields) || {};
    return {
      ...patient,
      full_name: `${patient.last_name}, ${patient.first_name} ${patient.middle_name}`,
      ...additionalFields,
    };
  });

  const getAdditionalFields = () => {
    const allKeys = rows.reduce((keys: string[], patient: any) => {
      if (patient.additional_fields) {
        keys.push(...Object.keys(JSON.parse(patient.additional_fields)));
      }
      return keys;
    }, []);
    return Array.from(new Set<string>(allKeys));
  };

  const [patientModalIsOpen, setPatientModalIsOpen] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  const [mutationSnackbarMessage, setMutationSnackbarMessage] =
    useState<string>('');

  const theme = useTheme();

  const handleOpenNewPatientModal = () => {
    setSelectedPatient(null);
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
  };

  const handleCreatePatient = async (payload: any) => {
    try {
      const created = await post('/api/patients', payload);
      setMutationSnackbarMessage(
        `Created a new patient: ${created.firstName} ${created.lastName}`
      );
      setPatientModalIsOpen(false);
    } catch (error) {
      console.log('Error creating patient');
    }
  };

  const handleEditPatient = async (payload: any) => {
    try {
      if (selectedPatient) {
        const updated = await put(
          `/api/patients/${selectedPatient.id}`,
          payload
        );
        setMutationSnackbarMessage(
          `Updated patient: ${updated.firstName} ${updated.lastName}`
        );
      }
      setPatientModalIsOpen(false);
    } catch (error) {
      console.log('Error updating patient');
    }
  };

  const handleDeletePatient = async () => {
    try {
      if (selectedPatient) {
        const deleted = await del(`/api/patients/${selectedPatient.id}`);
        setMutationSnackbarMessage(deleted.message);
        setWarningDialogIsOpen(false);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Container sx={{ padding: '50px' }}>
      {patientModalIsOpen && (
        <PatientModal
          isOpen={patientModalIsOpen}
          onCloseModal={() => setPatientModalIsOpen(false)}
          onCreateNewPatient={handleCreatePatient}
          patient={selectedPatient ?? null}
          onEditPatient={handleEditPatient}
        />
      )}
      {warningDialogIsOpen && selectedPatient && (
        <DeleteWarningDialog
          isOpen={warningDialogIsOpen}
          onCloseModal={() => setWarningDialogIsOpen(false)}
          onConfirmDeletion={handleDeletePatient}
          patient={selectedPatient}
        />
      )}
      <Typography variant="h4" sx={{ paddingBottom: '20px' }}>
        Patient Data
      </Typography>
      <Button onClick={handleOpenNewPatientModal}>Add a new Patient</Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
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
          columns={generateGridColDef(
            handleDeleteClick,
            handleEditClick,
            getAdditionalFields()
          )}
          rows={rows}
        />
      </Box>
      <MutationSnackbar
        isOpen={!!mutationSnackbarMessage}
        onCloseSnackbar={() => setMutationSnackbarMessage('')}
        message={mutationSnackbarMessage}
      />
    </Container>
  );
};

export default PatientDataView;
