import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";

import { Generatelast12MonthsData } from "../utils/analytic";
import { User } from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";

export const getUseranalytic = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await Generatelast12MonthsData(User);
        res.status(200).json({
            success: true,
            message: "User analytic retrieved successfully",
            user
        })
        
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
});

export const getCourseanalytic = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const course = await Generatelast12MonthsData(Course);
        res.status(200).json({
            success: true,
            message: "course analytic retrieved successfully",
            course
        })
        
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
});

export const Orderanalytic = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Generatelast12MonthsData(Order);
        res.status(200).json({
            success: true,
            message: "order analytic retrieved successfully",
            order
        })
        
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
});