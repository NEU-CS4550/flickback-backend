import * as auth from "../utils/auth.js";
import { users, follows } from "../database/models.js";

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
      try {
        const profile = await auth.getProfile(user.id);
        res.json(profile);
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
      const profile = await auth.getProfile(profileId);
      res.json(profile);
    } catch (e) {
      res.sendStatus(404);
    }
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
