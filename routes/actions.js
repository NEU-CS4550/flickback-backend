import * as auth from "../utils/auth.js";
import { api } from "../utils/api.js";
import { follows, ratings, watchlists } from "../database/models.js";

export default function ActionRoutes(app) {
  // Search movies by query string
  app.get("/actions/search", async (req, res) => {
    const query = req.query.query;
    const page = req.query.page;
    if (query === "") return res.json([]);
    const response = await api.get(
      `/search/movie?query=${query}&language=en-US&page=${page}`
    );
    res.json(response.data);
  });

  // Follow user by ID
  app.post("/actions/follow/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await follows.findOneAndUpdate(
        { userId: user.id, follows: profileId },
        {},
        { upsert: true }
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Unfollow user by ID
  app.post("/actions/unfollow/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await follows.findOneAndDelete({ userId: user.id, follows: profileId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Add movie to watchlist
  app.post("/actions/watchlist/:movieId", async (req, res) => {
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
  app.delete("/actions/watchlist/:movieId", async (req, res) => {
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
  app.post("/actions/rate/:movieId", async (req, res) => {
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
  app.delete("/actions/rate/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await ratings.findOneAndDelete({ userId: user.id, movieId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
}
