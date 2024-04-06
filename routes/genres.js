export default async function GenreRoutes(app, genres) {
  // Popular movies
  app.get("/genres", async (req, res) => {
    console.log(req.app.locals.genre);
    res.json(req.app.locals.genres);
  });
}
