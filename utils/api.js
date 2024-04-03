import "dotenv/config";
import axios from "axios";

const api_url = process.env.API_URL;
const api_key = process.env.API_KEY;

export const instance = axios.create({
  baseURL: api_url,
  headers: {
    Authorization: "Bearer " + api_key,
  },
});
