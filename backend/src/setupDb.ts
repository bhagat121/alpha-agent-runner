import { pool } from "./new";


async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS runs (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      prompt TEXT NOT NULL,
      tool VARCHAR(50) NOT NULL,
      raw_result TEXT,
      response TEXT
    );
  `;

  await pool.query(query);
  console.log("Table created successfully");
  process.exit();
}

createTable().catch((err) => {
  console.error("Error creating table:", err);
  process.exit(1);
});
