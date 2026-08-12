import express from "express";
import { optionalProtect } from "../middleware/auth.middleware.js";
import { syncLimiter } from "../middleware/rateLimiter.js";

import { syncNews, getNews, searchNews } from "../controllers/news.controller.js";

const router = express.Router();

router.post("/sync", syncLimiter, syncNews);
router.get("/", optionalProtect ,getNews);
router.get("/search", searchNews);


export default router;