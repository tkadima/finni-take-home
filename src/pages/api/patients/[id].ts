import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      db.all(`DELETE FROM patients WHERE id = ${id}`);
      res.status(200).json({ message: `Deleted patient with id ${id}` });
    } catch (error: any) {
      res.status(500).json({
        message: `Unable to delete patient with id ${id}`,
        error: error.message,
      });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { firstName, middleName, lastName, dob, status, addresses, fields } =
      req.body;

    const addressesJson = JSON.stringify(addresses || []);
    const fieldsJson = JSON.stringify(fields || {});

    const sql = `
      UPDATE patients
      SET first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, status = ?, addresses = ?, additional_fields = ?
      WHERE id = ?
    `;

    const data = await db.run(sql, [
      firstName || '',
      middleName || '',
      lastName || '',
      dob || '',
      status || 'Inquiry', // TODO: check with miquel
      addressesJson,
      fieldsJson,
      id,
    ]);

    res.status(200).json({
      id,
      firstName,
      middleName,
      lastName,
      dob,
      status,
      addresses,
      fields,
    });
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
