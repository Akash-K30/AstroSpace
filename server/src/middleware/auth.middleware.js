import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {

    try {

        const token = req.cookies?.token;


        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        next(err);
    }

}





export const optionalProtect = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return next(); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

       
        const user = await User.findById(decoded.id).select("-password");
        
        if (user) {
            req.user = user; 
        } else {
            req.user = null; 
        }
    } catch (err) {
        console.log("Optional auth token invalid:", err.message);
        req.user = null; 
    }

    next();
};

export default protect;

