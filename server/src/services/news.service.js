import { fetchSpaceflightNews } from "./spaceflight.service.js";
import { fetchApod } from "./nasa.service.js";

export const getAllNews = async () => {
    const results = await Promise.allSettled([
        fetchSpaceflightNews(),
        fetchApod()
    ]);

    // If fulfilled, return the data. If rejected, return an empty array/null instead of crashing.
    return {
        spaceflight: results[0].status === 'fulfilled' ? results[0].value : [],
        apod: results[1].status === 'fulfilled' ? results[1].value : null
    };
};