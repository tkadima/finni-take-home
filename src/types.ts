interface Address {
  addressLine1: string;
  addressLine2: string; 
  city: string; 
  state: string;
  zipcode: string;
}

interface AdditionalField {
  field_name: string;
  field_value: string;
}

interface PatientData {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  status: string;
  addresses: string; // JSON string
  additional_fields: string; // JSON string
}
