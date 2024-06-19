-- Clear the patients table
DELETE FROM patients;

-- Seed the patients table with sample data
INSERT INTO patients (first_name, middle_name, last_name, date_of_birth, status, addresses, additional_fields)
VALUES 
('John', 'A', 'Doe', '1990-01-01', 'Inquiry', '[{"type": "home", "address": "123 Main St"}]', '[{"field_name": "Preferred Language", "field_value": "English"}]'),
('Jane', 'B', 'Smith', '1985-05-12', 'Onboarding', '[{"type": "work", "address": "456 Oak Ave"}]', '[{"field_name": "Preferred Contact", "field_value": "Email"}]'),
('Emily', 'C', 'Jones', '1978-02-24', 'Active', '[{"type": "home", "address": "789 Pine St"}]', '[{"field_name": "Allergies", "field_value": "Peanuts"}]'),
('Michael', 'D', 'Brown', '1995-07-08', 'Churned', '[{"type": "home", "address": "101 Maple St"}]', '[{"field_name": "Primary Physician", "field_value": "Dr. Smith"}]');