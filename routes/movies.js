import { api } from "../utils/api.js";
import * as auth from "../utils/auth.js";
import { watchlists, ratings } from "../database/models.js";

export default function MovieRoutes(app) {
  // List of movies in theaters now
  app.get("/movies/playing", async (req, res) => {
    try {
      const response = await api.get(
        "/movie/now_playing?language=en-US&page=1"
      );
      res.json(response.data);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  // List of most popular movies
  app.get("/movies/popular", async (req, res) => {
    try {
      const response = await api.get("/movie/popular?language=en-US&page=1");
      res.json(response.data);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  // List of movies trending today
  app.get("/movies/trending", async (req, res) => {
    try {
      const response = await api.get("/trending/movie/day?language=en-US");
      res.json(response.data);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  // Get movie by ID
  app.get("/movies/:movieId", async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const response = await api.get(`/movie/${movieId}?language=en-US`);
      res.json(response.data);
    } catch (e) {
      res.sendStatus(e.response.status);
    }
  });

  app.get("/movies/:movieId/ratings", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      const mine = await ratings.findOne({ movieId, userId: user.id });
      const others = await ratings.find({ movieId, userId: { $ne: user.id } });
      res.json({ mine, others });
    } else {
      const response = await ratings.find({ movieId });
      res.json(response);
    }
  });
}
