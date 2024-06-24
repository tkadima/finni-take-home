import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  const db = await open({
    filename: path.join(process.cwd(), 'src', 'database', 'db.sqlite'),
    driver: sqlite3.Database,
  });

  const migrationFilePath = path.resolve(
    __dirname,
    'migrations',
    '0002_seed_patients.sql'
  );

  // Ensure the table creation script has been run
  const tableCreationScript = await fs.promises.readFile(
    migrationFilePath,
    'utf-8'
  );
  await db.exec(tableCreationScript);

  // Insert 100 rows with random data
  const stmt = await db.prepare(
    'INSERT INTO patients (first_name, middle_name, last_name, date_of_birth, status, addresses, additional_fields) VALUES (?, ?, ?, ?, ?, ?, ?)'
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
        addressLine2: faker.location.buildingNumber(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipcode: faker.location.zipCode(),
      },
    ]);
    const additionalFields = JSON.stringify(
      { 'Preferred Language' : 'English' },
    );

    await stmt.run(
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      status,
      addresses,
      additionalFields
    );
  }
  await stmt.finalize();

  console.log('Database seeded successfully!');
}

seedDatabase().catch((err) => {
  console.error('Error seeding database:', err);
});
