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
  }
  if (req.method === 'PATCH') {
    console.log('doing a patch', req.body);
  }
}
