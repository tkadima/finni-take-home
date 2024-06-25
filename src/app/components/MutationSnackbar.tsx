import { Snackbar } from '@mui/material';

type MutationSnackbarProps = {
  isOpen: boolean;
  onCloseSnackbar: () => void;
  message: string; 
};
const MutationSnackbar = ({
  isOpen,
  onCloseSnackbar,
  message,
}: MutationSnackbarProps) => {

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={60000}
      onClose={onCloseSnackbar}
      message={message}
    />
  );
};

export default MutationSnackbar;
