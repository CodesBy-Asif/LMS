import { NextFunction,Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import Order from "../models/order.model";

export const createOrder = CatchAsyncError(async (data: any,res:Response,next:NextFunction) => {
    const order = await Order.create(data);
    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
    });
});