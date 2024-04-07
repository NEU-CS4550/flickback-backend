import { users } from "../database/models.js";

export default function UserRoutes(app) {
  // In theaters now
  app.get("/users", async (req, res) => {
    const response = await users.create({
      username: "test",
      passwordHash: "xxx",
    });
    res.json(response.data);
  });
}
