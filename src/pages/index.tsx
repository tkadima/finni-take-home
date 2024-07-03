import { lazy, Suspense, useState } from 'react';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import useFetch from '../hooks/useFetch';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { generateGridColDef } from '../app/utils/generateGridColDef';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const PatientModal = lazy(() => import('../app/components/PatientModal'));
const DeleteWarningDialog = lazy(
  () => import('../app/components/DeleteWarningDialog')
);
const MutationSnackbar = lazy(
  () => import('../app/components/MutationSnackbar')
);

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await axios.get('http://localhost:3000/api/patients');
  const data = response.data;
  return {
    props: {
      initialPatients: data,
    },
  };
};

type PatientDataViewProps = {
  initialPatients: PatientData[];
};
const PatientDataView = ({ initialPatients }: PatientDataViewProps) => {
  const {
    data: patients,
    isLoading,
    isError,
    post,
    put,
    del,
  } = useFetch('/api/patients', { initialData: initialPatients });

  const rows = patients.map((patient: PatientData) => {
    const additionalFields = JSON.parse(patient.additional_fields) || {};
    return {
      ...patient,
      full_name: `${patient.last_name}, ${patient.first_name} ${patient.middle_name}`,
      phone_numbers: `${patient.primary_phone_number}, ${patient.secondary_phone_number}`,
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

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const theme = useTheme();

  const handleAddClick = () => {
    setSelectedPatient(null);
    setModalMode('create');
    setPatientModalIsOpen(true);
  };

  const handleEditClick = (id: number) => {
    const patient = patients.find((patient: PatientData) => patient.id === id);
    if (patient) {
      setModalMode('edit');
      setSelectedPatient(patient);
      setPatientModalIsOpen(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    const patient = patients.find((patient: PatientData) => patient.id === id);
    if (patient) {
      setSelectedPatient(patient);
      setWarningDialogIsOpen(true);
    }
  };

  const handleCreatePatient = async (payload: any) => {
    try {
      const created = await post('/api/patients', payload);
      setMutationSnackbarMessage(
        `Created a new patient: ${created.firstName} ${created.lastName}`
      );
      setPatientModalIsOpen(false);
    } catch (error) {
      console.log('Error creating patient', error);
    }
  };

  const handleEditPatient = async (payload: any) => {
    console.log('handle edit payload', payload);
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
      setSelectedPatient(null);
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
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <ProtectedRoute>
      <Container sx={{ padding: '50px' }}>
        <Typography variant="h4" sx={{ paddingBottom: '20px' }}>
          Patient Data
        </Typography>
        <Button onClick={handleAddClick}>Add a new Patient</Button>
        <Box sx={{ height: '100vh', width: '100%' }}>
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
        <Suspense fallback={<div>Loading...</div>}>
          <PatientModal
            mode={modalMode}
            isOpen={patientModalIsOpen}
            onCloseModal={() => {
              setSelectedPatient(null);
              setPatientModalIsOpen(false);
            }}
            onCreateNewPatient={handleCreatePatient}
            patient={selectedPatient ?? null}
            onEditPatient={handleEditPatient}
          />
          <DeleteWarningDialog
            isOpen={warningDialogIsOpen}
            onCloseModal={() => {
              setSelectedPatient(null);
              setWarningDialogIsOpen(false);
            }}
            onConfirmDeletion={handleDeletePatient}
            patient={selectedPatient}
          />
          <MutationSnackbar
            isOpen={!!mutationSnackbarMessage}
            onCloseSnackbar={() => setMutationSnackbarMessage('')}
            message={mutationSnackbarMessage}
          />
        </Suspense>
      </Container>
    </ProtectedRoute>
  );
};

export default PatientDataView;
