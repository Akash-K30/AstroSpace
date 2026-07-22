import User from "../models/User.js";
import Article from "../models/Article.js";


// POST /api/bookmarks/:articleId

export const addBookmark = async (req, res, next) => {

    try {

        const userId = req.user._id;

        const { articleId } = req.params;

        const article = await Article.findById(articleId);

        if (!article) {

            return res.status(404).json({

                success: false,

                message: "Article not found"

            });

        }

        const user = await User.findById(userId);

        const alreadyBookmarked = user.bookmarks.includes(articleId);

        if (alreadyBookmarked) {

            return res.status(400).json({

                success: false,

                message: "Already bookmarked"

            });

        }

        user.bookmarks.push(articleId);

        await user.save();

        res.status(200).json({

            success: true,

            message: "Bookmark added"

        });

    }

    catch (err) {

        next(err);

    }

};




// DELETE

export const removeBookmark = async (req, res, next) => {

    try {

        const user = await User.findById(req.user._id);

        user.bookmarks = user.bookmarks.filter(

            bookmark =>

                bookmark.toString() !== req.params.articleId

        );

        await user.save();

        res.json({

            success: true,

            message: "Bookmark removed"

        });

    }

    catch (err) {

        next(err);

    }

};




// GET ALL

export const getBookmarks = async (req, res, next) => {

    try {

        const user = await User.findById(req.user._id)

            .populate({

                path: "bookmarks",

                options: {

                    sort: {

                        publishedAt: -1

                    }

                }

            });

        res.json({

            success: true,

            bookmarks: user.bookmarks

        });

    }

    catch (err) {

        next(err);

    }

};