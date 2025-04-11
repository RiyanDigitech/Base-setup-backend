import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(urlencoded()); // Updated limit and extended
app.use(cookieParser());
app.use(express.static('temps'))

// Routes
app.use("/api", authRoutes);

// Error handling middleware
app.use(errorHandler);

export { app };
