import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import MovieRoutes from "./routes/movies.js";
import UserRoutes from "./routes/users.js";
import AuthRoutes from "./routes/auth.js";
import ActionRoutes from "./routes/actions.js";
import AdminRoutes from "./routes/admin.js";

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
app.use(cookieParser());

//cors and preflight filtering
app.all("*", function (req, res, next) {
  res.set(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );
  if (req.method == "OPTIONS") return res.sendStatus(204);
  next();
});

AuthRoutes(app);
MovieRoutes(app);
UserRoutes(app);
ActionRoutes(app);
AdminRoutes(app);

app.listen(port);

export default app;
