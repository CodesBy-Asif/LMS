import express from "express";
import { getNotifications, updateNotification } from "../controller/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAcesstoken } from "../controller/user.controller";

const notificationRoutes = express.Router();

notificationRoutes.get("/get-all",isAuthenticated,authorizeRoles("admin"),getNotifications);
notificationRoutes.put("/update/:id",isAuthenticated,authorizeRoles("admin"),updateNotification);

export default notificationRoutes;
