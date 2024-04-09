import { api } from "../utils/api.js";

export default function SearchRoutes(app) {
  // Search movies by query string
  app.post("/actions/search", async (req, res) => {
    const query = req.body.query;
    if (query === "") return res.json([]);
    const response = await api.get(
      `/search/movie?query=${query}&language=en-US&page=1`
    );
    res.json(response.data);
  });
}