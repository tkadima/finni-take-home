import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';

type DeleteWarningDialogPropTypes = {
  isOpen: boolean;
  onCloseModal: () => void;
  patient: PatientData | null;
  onConfirmDeletion: () => void;
};

const DeleteWarningDialog = ({
  isOpen,
  onCloseModal,
  patient,
  onConfirmDeletion,
}: DeleteWarningDialogPropTypes) => {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onClose={onCloseModal}>
      <DialogTitle>
        Warning: You are about to permanently delete this patient!
      </DialogTitle>
      <DialogContent>
        <Typography>
          Patient: {patient.first_name} {patient.middle_name}{' '}
          {patient.last_name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseModal}>Cancel</Button>
        <Button onClick={onConfirmDeletion} autoFocus>
          Delete Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWarningDialog;
