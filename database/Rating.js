import mongoose from "mongoose";
import { api } from "../utils/api.js";

const RatingSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    pfp: String,
    movieId: {
      type: Number,
      default: () => {
        return Math.floor(Math.random() * 1000000) + 5;
      },
    },
    movieName: String,
    score: Number,
    review: {
      type: String,
      default: "",
    },
    submitted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

RatingSchema.pre("save", async function (next) {
  if (!this.movieName) {
    const movie = await api.get(`/movie/${this.movieId}?language=en-US`);
    this.movieName = movie.data.title;
    next();
  }
});

const ratings = new mongoose.model("Rating", RatingSchema);

export default ratings;
