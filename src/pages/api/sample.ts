import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const data = await db.all('SELECT 1 as id, "Sample Data" as name');

  res.status(200).json(data);
}
