import { Response,Request,NextFunction } from "express";
import ErorHandler from "../utils/ErrorHandler";
import redis from "../utils/redis";
import jwt,{JwtPayload} from "jsonwebtoken";
import { CatchAsyncError } from "./CatchAsyncError";
require('dotenv').config();

export const isAuthenticated = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
    const { access_Token } = req.cookies;
    if (!access_Token) {
        return next(new ErorHandler("plaese login to access this resource", 400));
    }
    const decoded = jwt.verify(access_Token, process.env.ACCESS_SECRET_KEY as string) as JwtPayload;

    if (!decoded) {
        return next(new ErorHandler("Invalid Token. Please login again", 401));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErorHandler("please login to access this resource", 400));
    }
    req.user = JSON.parse(user) as any;
    next();
});

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {    
            return next(new ErorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    };
}

