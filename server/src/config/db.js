import { config } from 'dotenv';
import {Pool} from 'pg'

config()

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in .env');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires TLS; this is fine for app-level clients
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});


