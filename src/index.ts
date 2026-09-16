import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./router/auth.router.js";
import { infoLog } from "./util/logger.js";
import { env } from "./util/envLoader.js";

// Server Configuration
const PORT = env.PORT;

const app = express();

// Middleware and Router Configuration
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.listen(PORT, () => infoLog(`Server running at PORT = ${PORT}`));
