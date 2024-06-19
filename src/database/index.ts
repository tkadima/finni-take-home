import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPromise = open({
  filename: path.join(process.cwd(), 'src', 'database', 'db.sqlite'),
  driver: sqlite3.Database,
});

export const getDb = async () => {
  try {
    const db = await dbPromise;
    // await db.migrate({
    //   migrationsPath: path.join(process.cwd(), 'src', 'database', 'migrations'),
    //   force: true,
    // });
    return db;
  } catch (error) {
    console.error('Failed to open the database:', error);
    throw error;
  }
};
