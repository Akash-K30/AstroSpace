import Comment from "../models/Comment.js";
import Article from "../models/Article.js";



// POST

export const addComment = async (req, res, next) => {

    try {

        const { articleId } = req.params;

        const { text } = req.body;

        if (!text || text.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Comment cannot be empty"

            });

        }

        const article = await Article.findById(articleId);

        if (!article) {

            return res.status(404).json({

                success: false,

                message: "Article not found"

            });

        }

        const comment = await Comment.create({

            user: req.user._id,

            article: articleId,

            text

        });

        await comment.populate(

            "user",

            "name avatar"

        );

        res.status(201).json({

            success: true,

            comment

        });

    }

    catch (err) {

        next(err);

    }

};

export const getComments = async (req, res, next) => {

    try {

        const comments = await Comment.find({

            article: req.params.articleId

        })

        .populate(

            "user",

            "name avatar"

        )

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            comments

        });

    }

    catch (err) {

        next(err);

    }

};

export const deleteComment = async (req, res, next) => {

    try {

        const comment = await Comment.findById(

            req.params.commentId

        );

        if (!comment) {

            return res.status(404).json({

                success: false,

                message: "Comment not found"

            });

        }

        if (

            comment.user.toString() !==

            req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message: "Not authorized"

            });

        }

        await comment.deleteOne();

        res.json({

            success: true,

            message: "Comment deleted"

        });

    }

    catch (err) {

        next(err);

    }

};