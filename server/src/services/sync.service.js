import Article from "../models/Article.js";
import { getAllNews } from "./news.service.js";
import { normalizeApod, normalizeSpaceflight } from "../utils/normalize.js";

export const executeNewsSync = async () => {
    const { spaceflight, apod } = await getAllNews();

    const normalizedArticles = [
        ...spaceflight.map(article => normalizeSpaceflight(article)),
        ...(Array.isArray(apod) ? apod : [apod]).map(item => normalizeApod(item))
    ];

    const docs = normalizedArticles.map(article => ({
        updateOne: {
            filter: { url: article.url },
            update: { $setOnInsert: article },
            upsert: true
        }
    }));

    await Article.bulkWrite(docs);
};