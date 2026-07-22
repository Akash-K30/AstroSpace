import Article from "../models/Article.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js"; // Added import

import { getAllNews } from "../services/news.service.js";
import { normalizeApod, normalizeSpaceflight } from "../utils/normalize.js";
import { executeNewsSync } from "../services/sync.service.js";

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

    const [articles, user] = await Promise.all([
      Article.find(filter).sort(sortSpec).skip(skip).limit(limit).lean(),
      userId ? User.findById(userId).select("bookmarks").lean() : null,
    ]);

    if (!articles.length) return res.json([]);

    const articleIds = articles.map((a) => a._id);

    const [commentCounts, userLikes] = await Promise.all([
      Comment.aggregate([
        { $match: { article: { $in: articleIds } } },
        { $group: { _id: "$article", count: { $sum: 1 } } },
      ]),
      userId
        ? Like.find({ user: userId, article: { $in: articleIds } }).select("article").lean()
        : [],
    ]);

    const commentCountMap = commentCounts.reduce((acc, c) => {
      acc[c._id.toString()] = c.count;
      return acc;
    }, {});
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