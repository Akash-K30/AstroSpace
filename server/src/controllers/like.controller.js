import Like from "../models/Like.js";
import Article from "../models/Article.js";

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { articleId } = req.params;

    const existing = await Like.findOne({ user: userId, article: articleId });

    if (existing) {
      await existing.deleteOne();
      const updated = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { likeCount: -1 } },
        { new: true }
      ).select("likeCount");
      return res.json({ liked: false, likeCount: updated.likeCount });
    }

    await Like.create({ user: userId, article: articleId });
    const updated = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { likeCount: 1 } },
      { new: true }
    ).select("likeCount");
    return res.json({ liked: true, likeCount: updated.likeCount });
  } catch (error) {
    res.status(500).json({ message: "Server error toggling like", error: error.message });
  }
};

