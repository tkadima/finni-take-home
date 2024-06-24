import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === 'GET') {
    // server side pagination
    const data = await db.all('SELECT * FROM patients');
    res.status(200).json(data);
  }
  if (req.method === 'POST') {
    const { firstName, middleName, lastName, dob, status, addresses, fields } =
      req.body;

    // Convert addresses and fields to JSON strings
    const addressesJson = JSON.stringify(addresses);
    const fieldsJson = JSON.stringify(fields);

    // SQL statement to insert data
    const sql = `
      INSERT INTO patients (
        first_name, middle_name, last_name, date_of_birth, status, addresses, additional_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert data into the database
    const data = await db.run(sql, [
      firstName,
      middleName,
      lastName,
      dob,
      status,
      addressesJson,
      fieldsJson,
    ]);

    res.status(201).json({ id: data.lastID, ...req.body });
  }
}
