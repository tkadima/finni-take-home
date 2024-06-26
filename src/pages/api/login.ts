import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../database';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
