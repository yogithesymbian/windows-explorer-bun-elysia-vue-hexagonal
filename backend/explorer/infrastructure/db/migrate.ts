// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/bun-sql';
// import { SQL } from 'bun';
// import { migrate } from 'drizzle-orm/bun-sql/migrator';

// const client = new SQL(process.env.DATABASE_URL!);
// const db = drizzle({ client });

// await migrate(db, { migrationsFolder: './drizzle' });
// console.log('✅ Migrations applied');
// process.exit(0);

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

const client = new SQL({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true // <-- TAMBAHKAN BARIS INI
});

const db = drizzle({ client });

await migrate(db, { migrationsFolder: './drizzle' });
console.log('✅ Migrations applied');
process.exit(0);