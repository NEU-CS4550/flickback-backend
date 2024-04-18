import * as auth from "../utils/auth.js";

export default function AuthRoutes(app) {
  // Register
  app.post("/auth/register", async (req, res) => {
    try {
      const response = await auth.register(
        req.body.username,
        req.body.password,
        req.body.role
      );
      res.json(response);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  // Login
  app.post("/auth/login", async (req, res) => {
    try {
      const response = await auth.login(req.body.username, req.body.password);
      res.json(response);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  // Update account
  app.put("/auth/update", async (req, res) => {
    const user = auth.authenticate(req.headers.authorization);
    if (user) {
      try {
        const response = await auth.update(
          user.id,
          req.body.username,
          req.body.password
        );
        res.json(response);
      } catch (e) {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  });
}
