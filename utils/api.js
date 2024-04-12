import "dotenv/config";
import axios from "axios";

const api_url = process.env.API_URL;
const api_key = process.env.API_KEY;

export const api = axios.create({
  baseURL: api_url,
  headers: {
    Authorization: "Bearer " + api_key,
  },
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
