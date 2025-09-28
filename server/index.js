import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "./config/passport.js";
import notFound from "./middlewares/pageNotFound.js";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
ConnectDB();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "https://www.flowwell.online",
            "https://flowwell.online",
            "http://localhost:5173",
        ],
        credentials: true,
    })
);

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.use(notFound);

app.listen(PORT);
