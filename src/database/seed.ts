import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

(async () => {
  // Open a database connection
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Read the SQL seed file
  const seedSQL = fs.readFileSync(
    path.join(__dirname, 'migrations/0002_seed_patients.sql'),
    'utf-8'
  );

  // Execute the SQL seed commands
  await db.exec(seedSQL);

  console.log('Seeding completed successfully.');
})();
