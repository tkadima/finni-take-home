import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === 'GET') {
    // Add Server side pagination?
    const data = await db.all('SELECT * FROM patients');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      status,
      addresses,
      fields,
      primaryPhoneNumber,
      secondaryPhoneNumber,
    } = req.body;

    if (!firstName || !lastName || !dob || !status || !primaryPhoneNumber) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one address is required' });
    }

    for (const address of addresses) {
      if (
        !address.addressLine1 ||
        !address.city ||
        !address.state ||
        !address.zipcode
      ) {
        return res
          .status(400)
          .json({ message: 'Required address fields are missing' });
      }
    }

    if (fields) {
      for (const key in fields) {
        if (!key) {
          return res
            .status(400)
            .json({ message: 'Keys in additional_fields cannot be empty' });
        }
      }
    }

    // Convert addresses and fields to JSON strings
    const addressesJson = JSON.stringify(addresses);
    const fieldsJson = JSON.stringify(fields);
    const phoneNumbers = [primaryPhoneNumber];

    if (secondaryPhoneNumber) phoneNumbers.push(secondaryPhoneNumber);
    const phoneJson = JSON.stringify(phoneNumbers);
    console.log('ph', phoneJson);
    const sql = `
      INSERT INTO patients (
        first_name, middle_name, last_name, date_of_birth, status, addresses, phone_numbers, additional_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      console.log('trying...'); // fix this, why is database not being updated?
      const data = await db.run(sql, [
        firstName,
        middleName,
        lastName,
        dob,
        status,
        addressesJson,
        phoneJson,
        fieldsJson,
      ]);
      console.log('data trying', data);

      res.status(201).json({ id: data.lastID, ...req.body });
    } catch (error: any) {
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
