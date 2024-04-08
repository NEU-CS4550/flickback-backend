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
      //res.cookie("token", response.token, auth.cookieSettings);
      //res.sendStatus(200);
      res.json(response.token);
    } else {
      res.status(400).json(response.message);
    }
  });

  // Login
  app.post("/users/login", async (req, res) => {
    const response = await auth.login(req.body.username, req.body.password);
    if (response.type == "success") {
      //res.cookie("token", response.token, auth.cookieSettings);
      //res.sendStatus(200);
      res.json(response.token);
    } else {
      res.status(400).json(response.message);
    }
  });

  app.get("/users/profile", async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.json(null);
    }

    token = token.substring(7);
    const user = auth.authenticate(token);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json("Invalid token");
    }
  });
}
