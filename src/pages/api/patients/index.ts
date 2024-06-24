import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDb();
  // server side pagination
  const data = await db.all('SELECT * FROM patients');
  res.status(200).json(data);
}
