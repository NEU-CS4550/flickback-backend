export default async function GenreRoutes(app, genres) {
  // Popular movies
  app.get("/genres", async (req, res) => {
    res.json(app.locals.genres);
  });
}
