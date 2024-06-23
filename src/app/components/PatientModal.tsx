import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

type NewPatientModalPropTypes = {
  isOpen: boolean;
  onCloseModal: (value: boolean) => void;
  patient: PatientData | null;
};

const PatientModal = ({
  isOpen,
  onCloseModal,
  patient,
}: NewPatientModalPropTypes) => {

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    status: '',
    addresses: [{ line1: '', line2: '', city: '', state: '', zipcode: '' }],
    fields: [],
  });

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (patient) {
      const patientAddress = JSON.parse(patient.addresses)
        .map((patientAddress: Address) =>  ({line1: patientAddress.addressLine1, line2: patientAddress.addressLine2, city: patientAddress.city,
        state: patientAddress.state,  zipcode: patientAddress.zipcode})); 
      setFormData({
        firstName: patient.first_name || '',
        middleName: patient.middle_name || '',
        lastName: patient.middle_name || '',
        dob: patient.date_of_birth || '',
        status: patient.status || '',
        addresses:  patientAddress || [
          { line1: '', line2: '', city: '', state: '', zipcode: '' },
        ],
        fields: JSON.parse(patient.additional_fields) || [],
      });
    }
  }, [patient]);

  const handleTabChange = (_event: any, newIndex: number) => {
    setTabIndex(newIndex);
  };


  const handleAddAddress = () => {
    const newAddresses =  [...formData.addresses, { line1: '', line2: '', city: '', state: '', zipcode: '' }]; 
    setFormData({...formData, addresses: newAddresses}); 
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({...formData, addresses: newAddresses}); 
  };


  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    if (name.startsWith('address')) { 
      const [, field, index] = name.split('-'); 
      const idx = parseInt(index, 10);
      setFormData((prevData) => ({
        ...prevData, 
        addresses: prevData.addresses.map((address, i) => i === idx ? {...address, [field]: value}: address) 
      }))
    }
    else { setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  };

  // TODO: handle configurable fields, abstract it
    // const handleAddNewField = () => {
  //   setFields([...fields, { type: '', fieldName: '', fieldValue: '' }]);
  // };

  // const handleFieldChange = (index: number, field: string, value: string) => {
  //   // fix so it's more readable
  //   const newFields = fields.map((newField: any, i: number) =>
  //     i === index ? { ...newField, [field]: value } : field
  //   );

  //   setFields(newFields);
  // };

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
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="patient-info-tabs"
        >
          <Tab label="Patient Info" />
          <Tab label="Addresses" />
          <Tab label="Additional Fields" />
        </Tabs>
        {tabIndex === 0 && (
          <Box>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Status"
              value={formData.status}
              onChange={handleChange}
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
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            {formData.addresses.map((address, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
              >
                <TextField
                  label="Street Name Line 1"
                  name={`address-line1-${index}`}
                  value={address.line1}
                  fullWidth
                  required
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Street Name Line 2"
                  name={`address-line2-${index}`}
                  value={address.line2}
                  fullWidth
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="City"
                  name={`address-city-${index}`}
                  value={address.city}
                  fullWidth
                  required
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="State"
                  name={`address-state-${index}`}
                  value={address.state}
                  fullWidth
                  required
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Zipcode"
                  name={`address-zipcode-${index}`}
                  value={address.zipcode}
                  fullWidth
                  required
                  onChange={handleChange}
                  margin="normal"
                />
                <Divider component="div" />
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveAddress(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={handleAddAddress} startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Add Address
            </Button>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default PatientModal;
