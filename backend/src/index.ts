import express from "express";
import cors from "cors";
import runRouter from "./routes/run";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// mount the router
app.use("/run", runRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
