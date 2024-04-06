import { instance } from "../utils/api.js";

let genres = {};

export async function setGenres() {
  const response = await instance.get("/genre/movie/list?language=en-US");
  for (const genre of response.data.genres) {
    genres[genre.id] = genre.name;
  }
}

export default async function GenreRoutes(app) {
  // Popular movies
  app.get("/genres", async (req, res) => {
    res.json(genres);
  });
}
