import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { api } from "./utils/api.js";
import * as db from "./database/models.js";
import GenreRoutes from "./routes/genres.js";
import MovieRoutes from "./routes/movies.js";
import UserRoutes from "./routes/users.js";

mongoose.connect(process.env.MONGODB_URI);

const app = express();
const port = 4000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

GenreRoutes(app);
MovieRoutes(app);
UserRoutes(app);

app.listen(port);

export default app;
