import * as auth from "../utils/auth.js";

export default function AuthRoutes(app) {
  // Register
  app.post("/auth/register", async (req, res) => {
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
  app.post("/auth/login", async (req, res) => {
    const response = await auth.login(req.body.username, req.body.password);
    if (response.type == "success") {
      //res.cookie("token", response.token, auth.cookieSettings);
      //res.sendStatus(200);
      res.json(response.token);
    } else {
      res.status(400).json(response.message);
    }
  });

  // Get session info
  app.get("/auth/session", async (req, res) => {
    const user = auth.authenticate(req.headers.authorization);
    res.json(user);
  });
}
