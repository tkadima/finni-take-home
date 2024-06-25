import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const getRandomAdditionalFields = (additionalFieldKeys: {[key: string]: string[]}) => {
  const result: { [key: string]: string } = {};
  const keys = Object.keys(additionalFieldKeys);
  
  // Randomly select 0 to all 3 keys
  const numberOfKeysToSelect = Math.floor(Math.random() * (keys.length + 1));
  const selectedKeys = keys.sort(() => 0.5 - Math.random()).slice(0, numberOfKeysToSelect);
  
  // For each selected key, select at least one value from the array
  selectedKeys.forEach(key => {
    const values = additionalFieldKeys[key];
    const numberOfValuesToSelect = Math.floor(Math.random() * values.length) + 1;
    const selectedValues = values.sort(() => 0.5 - Math.random()).slice(0, numberOfValuesToSelect);
    result[key] = selectedValues.join(', ');
  });
  return result; 
}

async function seedDatabase() {
  const db = await open({
    filename: path.join(process.cwd(), 'src', 'database', 'db.sqlite'),
    driver: sqlite3.Database,
  });

  const migrationFilePath = path.resolve(
    __dirname,
    'migrations',
    '0001_initial.sql'
  );

  // Ensure the table creation script has been run
  const tableCreationScript = await fs.promises.readFile(
    migrationFilePath,
    'utf-8'
  );
  await db.exec(tableCreationScript);

  // Insert 100 rows with random data
  const stmt = await db.prepare(
    'INSERT INTO patients (first_name, middle_name, last_name, date_of_birth, status, addresses, phone_numbers, additional_fields) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const statuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'];

  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();
    const dateOfBirth = faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString()
      .split('T')[0];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const addresses = JSON.stringify([
      {
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipcode: faker.location.zipCode(),
      },
    ]);
    const additionalFieldKeys = {'Preferred Language(s)': ['English', 'French', 'Spanish', 'Mandarin'],
     'Medications': ['adderral', 'wellbutrin', 'hydroxyzine'], 
     'Other diagnoses': ['Liver disease', 'ADHD', 'Depression', 'Generalize Anxiety disorder', 'Cerebral Palsy', 'OCD']} 

    const additionalFields = JSON.stringify(getRandomAdditionalFields(additionalFieldKeys)); 
    const phoneNumbers = JSON.stringify([faker.phone.number()]); 

    await stmt.run(
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      status,
      addresses,
      phoneNumbers,
      additionalFields,
    );
  }
  await stmt.finalize();

  console.log('Database seeded successfully!');
}

seedDatabase().catch((err) => {
  console.error('Error seeding database:', err);
});
