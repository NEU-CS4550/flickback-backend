import * as auth from "../utils/auth.js";
import { api } from "../utils/api.js";
import { users, follows, ratings, watchlists } from "../database/models.js";

export default function UserRoutes(app) {
  // Get list of all users
  app.get("/users", async (req, res) => {
    const response = await users.find({});
    res.json(response);
  });

  // Get current user
  app.get("/user", async (req, res) => {
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      try {
        let userInfo = await users.findOne({ _id: user.id });
        res.json({
          id: userInfo._id,
          username: userInfo.username,
          pfp: userInfo.pfp,
        });
      } catch (e) {
        res.sendStatus(500);
      }
    } else {
      res.json(null);
    }
  });

  // Get profile of user by ID
  app.get("/users/:profileId/profile", async (req, res) => {
    const profileId = req.params.profileId;
    try {
      const profile = await users.findOne({ _id: profileId });
      res.json({
        id: profile._id,
        username: profile.username,
        role: profile.role,
        pfp: profile.pfp,
      });
    } catch (e) {
      res.sendStatus(404);
    }
  });

  // Get ratings of user by ID
  app.get("/users/:profileId/ratings", async (req, res) => {
    const profileId = req.params.profileId;
    try {
      const userRatings = await ratings
        .find({ userId: profileId })
        .sort({ submitted: -1 });
      res.json(userRatings);
    } catch (e) {
      res.sendStatus(404);
    }
  });

  // Get followers of user by ID
  app.get("/users/:profileId/followers", async (req, res) => {
    const profileId = req.params.profileId;
    try {
      const followers = await follows.find({ follows: profileId });
      const results = await Promise.all(
        followers.map(async (rel) => {
          const user = await users.findOne({ _id: rel.userId });
          return {
            id: user._id,
            username: user.username,
            role: user.role,
            pfp: user.pfp,
          };
        })
      );
      res.json(results);
    } catch (e) {
      res.sendStatus(404);
    }
  });

  // Get following of user by ID
  app.get("/users/:profileId/following", async (req, res) => {
    const profileId = req.params.profileId;
    try {
      const followers = await follows.find({ userId: profileId });
      const results = await Promise.all(
        followers.map(async (rel) => {
          const user = await users.findOne({ _id: rel.follows });
          return {
            id: user._id,
            username: user.username,
            role: user.role,
            pfp: user.pfp,
          };
        })
      );
      res.json(results);
    } catch (e) {
      res.sendStatus(404);
    }
  });

  // Get watchlist of user by ID
  app.get("/users/:profileId/watchlist", async (req, res) => {
    const profileId = req.params.profileId;
    try {
      const watchlist = await watchlists.find({ userId: profileId });
      const results = await Promise.all(
        watchlist.map(async (rel) => {
          const movie = await api.get(`/movie/${rel.movieId}?language=en-US`);
          return {
            id: movie.data.id,
            title: movie.data.title,
            poster_path: movie.data.poster_path,
          };
        })
      );
      res.json(results);
    } catch (e) {
      res.sendStatus(404);
    }
  });
}
