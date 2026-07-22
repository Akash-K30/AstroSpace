import express from "express";

import protect from "../middleware/auth.middleware.js";

import {

addComment,

getComments,

deleteComment

}

from "../controllers/comment.controller.js";

const router = express.Router();

router.post(

"/:articleId",

protect,

addComment

);

router.get(

"/:articleId",

getComments

);

router.delete(

"/:commentId",

protect,

deleteComment

);

export default router;