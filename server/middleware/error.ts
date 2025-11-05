import ErorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

    //wrong mongoose object id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErorHandler(message, 400);
    }

    //mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErorHandler(message, 400);
    }

    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try Again!!!";
        err = new ErorHandler(message, 401);
    }
    //jwt expire error
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired. Try Again!!!";
        err = new ErorHandler(message, 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

};

export default errorMiddleware;