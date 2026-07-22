import express from "express";

import protect from "../middleware/auth.middleware.js";

import {

toggleLike

}

from "../controllers/like.controller.js";

const router=express.Router();

router.post(

"/:articleId",

protect,

toggleLike

);



export default router;