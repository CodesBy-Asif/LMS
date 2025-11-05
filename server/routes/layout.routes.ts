import express from "express";

import { CreateLayout, EditLayout, getLayoutBytype } from "../controller/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create", isAuthenticated,authorizeRoles("admin") ,CreateLayout);
router.put("/edit",isAuthenticated,authorizeRoles("admin") ,EditLayout);
router.get("/get/:type", getLayoutBytype);

export default router;