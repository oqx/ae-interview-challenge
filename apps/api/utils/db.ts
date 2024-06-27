import pg, { QueryResultRow } from 'pg';

export const query = async <T extends QueryResultRow>(query: string, values: any[] = []) => {
  const {Client} = pg;
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query<T>(query, values);
  await client.end();
  return res;
}