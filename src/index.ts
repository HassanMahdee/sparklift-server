import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongoDB, closeMongoDB } from "./db/mongodb.js";
import campaignRoutes from "./routes/campaignRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Sparklift Server is running" });
});

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await closeMongoDB();
  process.exit(0);
});
