import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    userId: String,
    movieId: Number,
  },
  {
    versionKey: false,
  }
);

const watchlists = new mongoose.model("Watchlist", WatchlistSchema);

export default watchlists;
