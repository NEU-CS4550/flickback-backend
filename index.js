import "dotenv/config";
import express from "express";
import cors from "cors";
import GenreRoutes, { setGenres } from "./routes/genres.js";
import MovieRoutes from "./routes/movies.js";

const app = express();
const port = 4000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

GenreRoutes(app);
MovieRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Once server starts up, fetch list of genres and store
// So we don't have to query API every time for genre lookup
app.listen(port, setGenres);
