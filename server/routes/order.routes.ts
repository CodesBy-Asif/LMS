import express from "express";

import { CreateOrder, getAllOrder,createPayment } from "../controller/order.controller";
import { authorizeRoles, isAuthenticated,} from "../middleware/auth";

const router = express.Router();

router.post("/create", isAuthenticated, CreateOrder);
router.get("/get-all",isAuthenticated,authorizeRoles("admin"),getAllOrder);
router.post("/create-intent", isAuthenticated, createPayment);

export default router;