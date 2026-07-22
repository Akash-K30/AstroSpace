import express from "express";

import protect from "../middleware/auth.middleware.js";

import {addBookmark,removeBookmark,getBookmarks} from "../controllers/bookmark.controller.js";

const router = express.Router();

router.post(    "/:articleId", protect, addBookmark);

router.delete(

    "/:articleId",

    protect,

    removeBookmark

);

router.get(

    "/",

    protect,

    getBookmarks

);

export default router;