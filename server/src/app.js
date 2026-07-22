import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import newsRoutes from "./routes/news.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.route.js";
import dashRoutes from "./routes/dash.route.js";


const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app"
    ],
    credentials: true
}));

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashRoutes);
app.use(errorHandler);

export default app;