import { users } from "../database/models.js";
import * as auth from "../utils/auth.js";

export default function UserRoutes(app) {
  // Get list of all users
  app.get("/users", async (req, res) => {
    const response = await users.find({});
    res.json(response);
  });

  // Register
  app.post("/users/register", async (req, res) => {
    const response = await auth.register(req.body.username, req.body.password);
    if (response.type == "success") {
      res.cookie("token", response.token, auth.cookieSettings);
      res.sendStatus(200);
    } else {
      res.status(400).json(response.message);
    }
  });

  // Login
  app.post("/users/login", async (req, res) => {
    const response = await auth.login(req.body.username, req.body.password);
    if (response.type == "success") {
      res.cookie("token", response.token, auth.cookieSettings);
      res.sendStatus(200);
    } else {
      res.status(400).json(response.message);
    }
  });

  // Logout
  app.post("/users/logout", async (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
  });

  app.get("/users/profile", async (req, res) => {
    const token = req.signedCookies.token;
    if (!token) {
      return res.json(null);
    }

    const user = await auth.authenticate(req.signedCookies.token);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json("Invalid token");
    }
  });
}
