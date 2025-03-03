import express from "express";
import authRoutes from "./routes/aut.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

import { connectDB } from "./lib/db.js";

app.use("/api/auth/", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(
    `Server running on port ${port} with link: http://localhost:${port}`
  );
  connectDB();
});
