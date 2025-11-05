import express from "express";
import { getCourseanalytic, getUseranalytic, Orderanalytic } from "../controller/analytic.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAcesstoken } from "../controller/user.controller";

const analyticRoutes = express.Router();

analyticRoutes.get("/user-analytic",isAuthenticated,authorizeRoles("admin"),getUseranalytic);
analyticRoutes.get("/course-analytic",isAuthenticated,authorizeRoles("admin"),getCourseanalytic);
analyticRoutes.get("/order-analytic",isAuthenticated,authorizeRoles("admin"),Orderanalytic);

export default analyticRoutes;