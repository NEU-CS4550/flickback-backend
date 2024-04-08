import { api } from "../utils/api.js";

export default function SearchRoutes(app) {
  app.post("/search", async (req, res) => {
    const query = req.body.query;
    if (query === "") return res.json([]);
    const response = await api.get(
      `/search/movie?query=${query}&language=en-US&page=1`
    );
    res.json(response.data);
  });
}
