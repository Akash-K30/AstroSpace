import Article from "../models/Article.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js"; // Added import

import { getAllNews } from "../services/news.service.js";
import { normalizeApod, normalizeSpaceflight } from "../utils/normalize.js";
import { executeNewsSync } from "../services/sync.service.js";
import { getCache, setCache } from "../services/cache.service.js";

const NEWS_CACHE_TTL = 60; // seconds

export const syncNews = async (req, res, next) => {
    try {
        await executeNewsSync();
        res.json({ message: "Sync complete" });
    } catch (err) {
        next(err);
    }
};

export const getNews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.$text = { $search: req.query.q };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.user?._id || req.user?.id;

    const sortSpec =
      req.query.sort === "popular"
        ? { likeCount: -1, publishedAt: -1 }
        : { publishedAt: -1 };

    // Cache key covers only the params that affect the shared query result
    const cacheKey = `news:list:${req.query.category || "all"}:${req.query.q || "none"}:${req.query.sort || "latest"}:${page}:${limit}`;

    let cached = await getCache(cacheKey);
    let articles;
    let commentCountMap;

    if (cached) {
      ({ articles, commentCountMap } = cached);
    } else {
      articles = await Article.find(filter).sort(sortSpec).skip(skip).limit(limit).lean();

      if (!articles.length) return res.json([]);

      const articleIds = articles.map((a) => a._id);
      const commentCounts = await Comment.aggregate([
        { $match: { article: { $in: articleIds } } },
        { $group: { _id: "$article", count: { $sum: 1 } } },
      ]);

      commentCountMap = commentCounts.reduce((acc, c) => {
        acc[c._id.toString()] = c.count;
        return acc;
      }, {});

      await setCache(cacheKey, { articles, commentCountMap }, NEWS_CACHE_TTL);
    }

    if (!articles.length) return res.json([]);

    const articleIds = articles.map((a) => a._id);

    const [user, userLikes] = await Promise.all([
      userId ? User.findById(userId).select("bookmarks").lean() : null,
      userId
        ? Like.find({ user: userId, article: { $in: articleIds } }).select("article").lean()
        : [],
    ]);

    const bookmarkSet = new Set(user?.bookmarks?.map((id) => id.toString()) || []);
    const likedSet = new Set(userLikes.map((l) => l.article.toString()));

    const decoratedArticles = articles.map((article) => {
      const idStr = article._id.toString();
      return {
        ...article,
        commentCount: commentCountMap[idStr] || 0,
        isLiked: likedSet.has(idStr),
        isBookmarked: bookmarkSet.has(idStr),
      };
    });

    res.json(decoratedArticles);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching news", error: error.message });
  }
};

export const searchNews = async (req, res) => {
  try {
    const q = req.query.q;
    const articles = await Article.find({
      $text: {
        $search: q
      }
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error searching news", error: error.message });
  }
};