import { api } from "../utils/api.js";

export default function MovieRoutes(app) {
  // In theaters now
  app.get("/movies/playing", async (req, res) => {
    const response = await api.get("/movie/now_playing?language=en-US&page=1");
    res.json(response.data);
  });

  // Popular movies
  app.get("/movies/popular", async (req, res) => {
    const response = await api.get("/movie/popular?language=en-US&page=1");
    res.json(response.data);
  });
}
