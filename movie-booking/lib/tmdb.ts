import axios from "axios";

export const apiTmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
});
