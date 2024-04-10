import * as auth from "../utils/auth.js";
import { users, follows, watchlists } from "../database/models.js";

// Helper function to get a full user profile
async function getProfile(userId) {
  const user = await users.findById(userId);
  const following = await follows.find({ userId });
  const followers = await follows.find({ follows: userId });
  const watchlist = await watchlists.find({ userId });
  return {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      pfp: user.pfp,
    },
    following: following.map((rel) => {
      return rel.follows;
    }),
    followers: followers.map((rel) => {
      return rel.userId;
    }),
    watchlist: watchlist.map((rel) => {
      return rel.movieId;
    }),
  };
}

export default function UserRoutes(app) {
  // Get list of all users
  app.get("/users", async (req, res) => {
    const response = await users.find({});
    res.json(response);
  });

  // Get profile of current user
  app.get("/profile", async (req, res) => {
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      const profile = await getProfile(user.id);
      res.json(profile);
    } else {
      res.json(null);
    }
  });

  // Get profile of user by ID
  app.get("/users/:profileId/profile", async (req, res) => {
    const profileId = req.params.profileId;
    const profile = await getProfile(profileId);
    res.json(profile);
  });

  // Follow user by ID
  app.post("/users/:profileId/follow", async (req, res) => {
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
  app.post("/users/:profileId/unfollow", async (req, res) => {
    const profileId = req.params.profileId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await follows.findOneAndDelete({ userId: user.id, follows: profileId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
}
