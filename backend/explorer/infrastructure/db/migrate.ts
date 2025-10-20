import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });

await migrate(db, { migrationsFolder: './drizzle' });
console.log('✅ Migrations applied');
process.exit(0);