interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
}

interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

interface PatientData {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  status: string;
  addresses: string; // JSON string
  primary_phone_number: string; 
  secondary_phone_number: string;
  additional_fields: string; // JSON string
}

interface PatientFormData {
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
