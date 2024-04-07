import { api } from "../utils/api.js";

export default async function GenreRoutes(app, genres) {
  // Popular movies
  app.get("/genres", async (req, res) => {
    const response = await api.get("/genre/movie/list?language=en-US");
    res.json(response.data);
  });
}
