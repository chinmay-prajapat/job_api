import express from "express";
import jobRouter from "../routers/job_api";
import authRouter from "../routers/auth";
import ErrorHandler from "../middlewares/errorHandler";
import * as dotenv from "dotenv";
import connectDB from "../db/connect";
import auth from "../middlewares/authentication";

// @ts-expect-error
import helmet from "helmet";
// Security Packages

// import helmet from "helmet";
import cors from "cors";
// @ts-expect-error
import xss from "xss-clean";
// const helmet = import("helmet");

// @ts-expect-error
import rateLimit from "express-rate-limit";
//

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Middlewares
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

//
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/job", auth, jobRouter);
app.get("*", (req, res) => res.status(404).json("Router Not Found!"));
app.use(ErrorHandler);
void (async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    app.listen(PORT, () => {
      console.log("Listing on ", PORT);
    });
  } catch (e) {
    console.log(e);
  }
})();
