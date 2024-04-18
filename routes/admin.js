import * as auth from "../utils/auth.js";
import { users, ratings } from "../database/models.js";

export default function AdminRoutes(app) {
  // Delete a user
  app.delete("/admin/delete/:userId", async (req, res) => {
    const userId = req.params.userId;
    const user = auth.authenticate(req.headers.authorization);
    if (user && user.role == "ADMIN") {
      const record = await users.findOneAndDelete({ _id: userId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Delete a rating
  app.delete("/admin/delete/:userId/:movieId", async (req, res) => {
    const movieId = req.params.movieId;
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      await ratings.findOneAndDelete({ userId: user.id, movieId });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  // Change username
  app.post("/admin/update/:userId", async (req, res) => {
    const userId = req.params.userId;
    const username = req.body.username;
    const user = auth.authenticate(req.headers.authorization);
    if (user && user.role == "ADMIN") {
      await users.findOneAndUpdate({ _id: userId }, { username });
      await ratings.updateMany({ userId }, { username });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
}
