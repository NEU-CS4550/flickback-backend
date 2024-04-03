import { instance } from "../utils/api.js";
import { genres } from "../index.js";

export default async function GenreRoutes(app) {
  // Popular movies
  app.get("/genres", async (req, res) => {
    res.json(genres);
  });
}
