// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/bun-sql';
// import { SQL } from 'bun';

// const client = new SQL(process.env.DATABASE_URL!);
// export const db = drizzle({ client });

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Pastikan port adalah angka
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true // <-- TAMBAHKAN BARIS INI
});

export const db = drizzle({ client });