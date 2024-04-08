import * as auth from "../utils/auth.js";
import { users, follows } from "../database/models.js";

async function getProfile(userId) {
  const user = await users.findById(userId);
  const following = await follows.find({ userId });
  const followers = await follows.find({ follows: userId });
  return {
    user,
    following: following.map((rel) => {
      return rel.follows;
    }),
    followers: followers.map((rel) => {
      return rel.userId;
    }),
  };
}

export default function UserRoutes(app) {
  // Get list of all users
  app.get("/users", async (req, res) => {
    const response = await users.find({});
    res.json(response);
  });

  app.get("/profile", async (req, res) => {
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      const profile = await getProfile(user.id);
      res.json(profile);
    } else {
      res.sendStatus(401);
    }
  });

  app.get("/users/:profileId/profile", async (req, res) => {
    const profileId = req.params.profileId;
    const profile = await getProfile(profileId);
    res.json(profile);
  });

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
