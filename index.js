import mongoose from "mongoose";
import express from "express";
import dotnev from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./routers/user.router.js";
import { routerStripe } from "./routers/Stripe.js";
let app = express();
dotnev.config();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://simple-eco-front.vercel.app"],
    credentials: true,
  })
);
let MONGODB = process.env.MONGODB;
let PORT = process.env.PORT || 4000;
mongoose
  .connect(MONGODB)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  );
mongoose.connection.on("connected", () => console.log("database running now!"));
mongoose.connection.on("disconnected", () => console.log(`database stopped!`));
app.use("/api/auth", userRouter);
app.use("/api/stripe", routerStripe);
app.use((err, req, res, next) => {
  let errorMessage = err.message || "Something went wrong";
  let errorStatus = err.status || 500;
  res.status(errorStatus).json(errorMessage);
});
