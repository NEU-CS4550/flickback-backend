import { api } from "../utils/api.js";

export default function MovieRoutes(app) {
  // In theaters now
  app.get("/movies/playing", async (req, res) => {
    const response = await api.get("/movie/now_playing?language=en-US&page=1");
    res.json(response.data);
  });

  // Most popular
  app.get("/movies/popular", async (req, res) => {
    const response = await api.get("/movie/popular?language=en-US&page=1");
    res.json(response.data);
  });

  // Trending today
  app.get("/movies/trending", async (req, res) => {
    const response = await api.get("/trending/movie/day?language=en-US");
    res.json(response.data);
  });
}
