import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import http from "http";

import { initSocket } from "./socket/socket.js";
import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/TaskRoute.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import dns from "dns";



import cors from "cors";



dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URL,
  Credential: true
}));

connectDB();

app.get("/", (req, res) => {
  res.send("Multi-Tenant SaaS running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});