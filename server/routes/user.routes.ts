import express from "express";
import { register,activateUser,login,logout,updateUserInfo,UpdateProfilePicture, updateUserPassword,updateAcesstoken, getMyProfile, socialLogin, getAllUser, updateUserRole, deleteUser } from "../controller/user.controller";
import {  isAuthenticated } from "../middleware/auth";
import { authorizeRoles } from "../middleware/auth";
const router = express.Router();

router.post("/register", register);
router.post("/activate", activateUser);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);
router.post("/refresh", updateAcesstoken);
router.get("/me", isAuthenticated, getMyProfile);
router.post("/social-login", socialLogin);
router.put("/update-user-info", isAuthenticated,updateUserInfo);
router.put("/update-user-password",isAuthenticated , updateUserPassword);
router.put("/update-user-avatar",isAuthenticated , UpdateProfilePicture);
router.get("/get-all",isAuthenticated,authorizeRoles("admin"),getAllUser);
router.put("/update-role",isAuthenticated,authorizeRoles("admin"),updateUserRole);
router.delete("/delete-user",isAuthenticated,authorizeRoles("admin"),deleteUser);




export default router;