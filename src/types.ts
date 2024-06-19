interface Address {
    type: string;
    address: string;
  }
  
  interface AdditionalField {
    field_name: string;
    field_value: string;
  }
  
  interface UserData {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    status: string;
    addresses: string; // JSON string
    additional_fields: string; // JSON string
  }
  