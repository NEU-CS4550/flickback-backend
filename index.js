import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import GenreRoutes from "./routes/genres.js";
import MovieRoutes from "./routes/movies.js";
import UserRoutes from "./routes/users.js";

mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = 4000;

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

GenreRoutes(app);
MovieRoutes(app);
UserRoutes(app);

app.listen(port);

export default app;
