import Notification from "../models/notification.model";
import { Request, Response , NextFunction }from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";
import cron from "node-cron";
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
res.status(200).json(
    {
        success: true,
        message: "Notifications retrieved successfully",
        notifications
    }
);
        
    } catch (error:any) {
   return next(new ErorHandler(error.message, 500));
    }
});
// update notification only adim

export const updateNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
       
        const notification = await Notification.findById(id);

        if (!notification) {
            return next(new ErorHandler("Notification not found", 404));
        }
        notification.status ?  notification.status="read" : notification.status;

        await notification.save();

 
        const notifications = await Notification.find().sort({ createdAt: -1 });
res.status(200).json(
    {
        success: true,
        message: "Notifications updated successfully",
        notifications
    }
);
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
});

cron.schedule("0 0 0 * * *", async () => {
    const thritydays = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30));
    await Notification.deleteMany({status:"read", createdAt: { $lt: thritydays } });
    console.log("Notifications deleted successfully");
});