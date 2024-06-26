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

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  status: string;
  addresses: Address[];
  fields: { [key: string]: string };
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
}

type PatientModalPropTypes = {
  isOpen: boolean;
  onCloseModal: () => void;
  patient: PatientData | null;
  onCreateNewPatient: (formData: FormData) => void;
  onEditPatient: (formData: FormData) => void;
};

const PatientModal = ({
  isOpen,
  onCloseModal,
  patient,
  onCreateNewPatient,
  onEditPatient,
}: PatientModalPropTypes) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    status: '',
    addresses: [
      { addressLine1: '', addressLine2: '', city: '', state: '', zipcode: '' },
    ],
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    fields: {},
  });
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);

  useEffect(() => {
    if (patient) {
      const patientAddress = JSON.parse(patient.addresses).map(
        (patientAddress: Address) => ({
          addressLine1: patientAddress.addressLine1,
          addressLine2: patientAddress.addressLine2,
          city: patientAddress.city,
          state: patientAddress.state,
          zipcode: patientAddress.zipcode,
        })
      );

      const patientAdditionalFields = JSON.parse(patient.additional_fields);

      setFormData({
        firstName: patient.first_name || '',
        middleName: patient.middle_name || '',
        lastName: patient.last_name || '',
        dob: patient.date_of_birth || '',
        status: patient.status || '',
        addresses: patientAddress || [
          {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipcode: '',
          },
        ],
        fields: patientAdditionalFields || {},
        primaryPhoneNumber: JSON.parse(patient.phone_numbers)[0] || '',
        secondaryPhoneNumber: JSON.parse(patient.phone_numbers)[1] || '',
      });
    }
  }, [patient]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        status: '',
        addresses: [
          {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipcode: '',
          },
        ],
        primaryPhoneNumber: '',
        secondaryPhoneNumber: '',
        fields: {},
      });
    }
  }, [isOpen]);

  const handleTabChange = (_event: any, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleAddAddress = () => {
    const newAddresses = [
      ...formData.addresses,
      { addressLine1: '', addressLine2: '', city: '', state: '', zipcode: '' },
    ];
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    const handleAddressChange = (field: string, index: number) => {
      setFormData((prevData) => ({
        ...prevData,
        addresses: prevData.addresses.map((address, i) =>
          i === index ? { ...address, [field]: value } : address
        ),
      }));
    };

    const handleConfigurableFieldChange = (field: string, index: number) => {
      const key = Object.keys(formData.fields)[index];
      const updatedFields = { ...formData.fields };

      if (field === 'value') {
        updatedFields[key] = value;
      } else {
        const configurableValue = formData.fields[key];
        delete updatedFields[key];
        updatedFields[value] = configurableValue;
      }

      setFormData((prevData) => ({
        ...prevData,
        fields: updatedFields,
      }));
    };

    if (name.startsWith('address')) {
      const [, field, indexStr] = name.split('-');
      const index = parseInt(indexStr, 10);
      handleAddressChange(field, index);
    } else if (name.startsWith('configurableField')) {
      const [, field, indexStr] = name.split('-');
      const index = parseInt(indexStr, 10);
      handleConfigurableFieldChange(field, index);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddNewConfigurableField = () => {
    setFormData({ ...formData, fields: { ...formData.fields, ['']: '' } });
  };

  const handleDeleteConfigurableField = (index: number) => {
    const key = Object.keys(formData.fields)[index];
    const updatedFields = { ...formData.fields };
    delete updatedFields[key];

    setFormData({ ...formData, fields: updatedFields });
  };

  const validateForm = () => {
    const { firstName, lastName, dob, status, addresses, primaryPhoneNumber } = formData;
    const isFormValid =
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      dob.trim() !== '' &&
      status.trim() !== '' &&
      addresses.every(
        (address) =>
          address.addressLine1.trim() !== '' &&
          address.city.trim() !== '' &&
          address.state.trim() !== '' &&
          address.zipcode.trim() !== ''
      ) && 
      primaryPhoneNumber.trim() !== ''; 
    setIsValidForm(isFormValid);
  };

  const handleSubmit = () => {
    if (patient) onEditPatient(formData);
    else onCreateNewPatient(formData);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

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
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="dob"
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
              name="status"
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
            <TextField
              label="Primary Phone Number"
              name="primaryPhoneNumber"
              value={formData.primaryPhoneNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            ></TextField>
            <TextField
              label="Secondary Phone Number"
              name="secondaryPhoneNumber"
              value={formData.secondaryPhoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            ></TextField>
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
                  name={`address-addressLine1-${index}`}
                  value={address.addressLine1}
                  fullWidth
                  required
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  label="Street Name Line 2"
                  name={`address-addressLine2-${index}`}
                  value={address.addressLine2}
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
            <Button
              onClick={handleAddAddress}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Address
            </Button>
          </Box>
        )}
        {tabIndex === 2 && (
          <Box>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddNewConfigurableField}
              sx={{ mt: 2 }}
            >
              Add New Field
            </Button>
            {formData.fields &&
              Object.keys(formData.fields).map(
                (field: string, index: number) => (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Name"
                      name={`configurableField-name-${index}`}
                      value={field}
                      onChange={handleChange}
                      margin="normal"
                    />
                    <TextField
                      label="Value"
                      name={`configurableField-value-${index}`}
                      value={formData.fields[field]}
                      onChange={handleChange}
                      margin="normal"
                    />

                    <IconButton
                      onClick={() => handleDeleteConfigurableField(index)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                )
              )}
          </Box>
        )}

        {tabIndex === 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            disabled={!isValidForm}
          >
            Submit
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default PatientModal;
