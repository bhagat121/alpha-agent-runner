import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "agent_runner",
  password: "password",
  port: 5432,
});
