import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, IconButton, Typography } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

type NewPatientModalPropTypes = {
    isOpen: boolean, 
    onCloseModal: (value: boolean) => void; 
}
const NewPatientModal = ({ isOpen, onCloseModal }: NewPatientModalPropTypes) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [status, setStatus] = useState('');
  const [addresses, setAddresses] = useState([{ line1: '', line2: '', city: '', state: '', zipcode: '' }]);

  const handleAddAddress = () => {
    setAddresses([...addresses, { line1: '', line2: '', city: '', state: '', zipcode: '' }]);
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const newAddresses = addresses.map((address, i) => (i === index ? { ...address, [field]: value } : address));
    setAddresses(newAddresses);
  };

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <Modal open={isOpen} onClose={onCloseModal}>
      <Box 
       sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        overflowY: 'auto',
      }}>
        <Typography variant='h4'>Add new Patient</Typography>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          select
          fullWidth
          required
          margin="normal"
        >
          {['Inquiry', 'Onboarding', 'Active', 'Churned'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {addresses.map((address, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Street Name Line 1"
              value={address.line1}
              onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Street Name Line 2"
              value={address.line2}
              onChange={(e) => handleAddressChange(index, 'line2', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              value={address.city}
              onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="State"
              value={address.state}
              onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Zipcode"
              value={address.zipcode}
              onChange={(e) => handleAddressChange(index, 'zipcode', e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            {index > 0 && (
              <IconButton onClick={() => handleRemoveAddress(index)}>
                <RemoveIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddAddress}>
          Add Address
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default NewPatientModal;
