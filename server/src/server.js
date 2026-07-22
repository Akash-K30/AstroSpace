import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./jobs/newsSync.job.js";

const PORT = process.env.PORT || 8181;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});