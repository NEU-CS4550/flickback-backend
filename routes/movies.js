import { api } from "../utils/api.js";
import * as auth from "../utils/auth.js";
import { watchlists, ratings } from "../database/models.js";

export default function MovieRoutes(app) {
  // List of movies in theaters now
  app.get("/movies/playing", async (req, res) => {
    const response = await api.get("/movie/now_playing?language=en-US&page=1");
    res.json(response.data);
  });

  // List of most popular movies
  app.get("/movies/popular", async (req, res) => {
    const response = await api.get("/movie/popular?language=en-US&page=1");
    res.json(response.data);
  });

  // List of movies trending today
  app.get("/movies/trending", async (req, res) => {
    const response = await api.get("/trending/movie/day?language=en-US");
    res.json(response.data);
  });

  // Get movie by ID
  app.get("/movies/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
    const response = await api.get(`/movie/${movieId}?language=en-US`);
    res.json(response.data);
  });

  // Add movie to watchlist
  app.post("/movies/:movieId/add", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await watchlists.findOneAndUpdate(
        { userId: user.id, movieId },
        {},
        { upsert: true }
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Remove movie from watchlist
  app.post("/movies/:movieId/remove", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await watchlists.findOneAndDelete({ userId: user.id, movieId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Rate a movie
  app.post("/movies/:movieId/rate", async (req, res) => {
    const movieId = req.params.movieId;
    const rating = req.body;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await ratings.findOneAndUpdate(
        {
          userId: user.id,
          movieId,
        },
        {
          userId: user.id,
          username: user.username,
          pfp: user.pfp,
          movieId,
          movieName: rating.movieName,
          score: rating.score,
          review: rating.review,
        },
        { upsert: true }
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Delete a movie rating
  app.post("/movies/:movieId/rate", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await ratings.findOneAndDelete({ userId: user.id, movieId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
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
