import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getDashboard,
    updateProfile,
    getLikedArticles,
    getMyComments
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getDashboard);

router.patch("/profile", updateProfile);

router.get("/likes", getLikedArticles);

router.get("/comments", getMyComments);

export default router;