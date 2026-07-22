import User from "../models/User.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";

export const getDashboard = async (req, res, next) => {
    try {

        const userId = req.user._id;

        const [user, likes, comments] = await Promise.all([
            User.findById(userId).select("name email avatar bookmarks"),
            Like.countDocuments({ user: userId }),
            Comment.countDocuments({ user: userId })
        ]);

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            stats: {
                bookmarks: user.bookmarks.length,
                likes,
                comments
            }
        });

    } catch (err) {
        next(err);
    }
};

export const getLikedArticles = async (req, res, next) => {
    try {

        const likes = await Like.find({
            user: req.user._id
        })
        .populate({
            path: "article",
            options: {
                sort: {
                    publishedAt: -1
                }
            }
        });

        const articles = likes.map(like => like.article);

        res.json({
            success: true,
            articles
        });

    } catch (err) {
        next(err);
    }
};

export const getMyComments = async (req, res, next) => {

    try {

        const comments = await Comment.find({
            user: req.user._id
        })
        .populate("article", "title")
        .sort({
            createdAt: -1
        });

        res.json({
            success: true,
            comments
        });

    } catch (err) {
        next(err);
    }

};

export const updateProfile = async (req, res, next) => {

    try {

        const { name, avatar } = req.body;

        const user = await User.findById(req.user._id).select('-password');

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            user
        });

    } catch (err) {
        next(err);
    }

};