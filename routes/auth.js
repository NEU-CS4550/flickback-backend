import * as auth from "../utils/auth.js";

export default function AuthRoutes(app) {
  // Register
  app.post("/auth/register", async (req, res) => {
    const response = await auth.register(
      req.body.username,
      req.body.password,
      req.body.role
    );
    res.json(response);
  });

  // Login
  app.post("/auth/login", async (req, res) => {
    const response = await auth.login(req.body.username, req.body.password);
    res.json(response);
  });
}
