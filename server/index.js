import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/auth", authRouter);
app.use('/api/profile', profileRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
