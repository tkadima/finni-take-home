import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

type DeleteWarningDialogPropTypes = {
  isOpen: boolean;
  onCloseModal: () => void;
  patient: PatientData;
  onConfirmDeletion: () => void;
};

const DeleteWarningDialog = ({
  isOpen,
  onCloseModal,
  patient,
  onConfirmDeletion,
}: DeleteWarningDialogPropTypes) => {
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
