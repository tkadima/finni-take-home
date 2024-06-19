CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  status TEXT CHECK(status IN ('Inquiry', 'Onboarding', 'Active', 'Churned')) NOT NULL,
  addresses JSON,
  additional_fields JSON
);
