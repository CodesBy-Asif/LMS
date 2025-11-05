import express from "express";
import { UploadCourse ,EditCourse, getSingleCourseWithoutPurchased, getAllCourseWithoutPurchased, getcousebyUser, AddQuestion, AddAnswer, AddReview, addReplytoReview, getAllCourse, deleteCourse, getUserCourses, UploadThumbnail} from "../controller/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create", isAuthenticated,authorizeRoles("admin") ,UploadCourse);
router.put("/edit/:id",isAuthenticated,authorizeRoles("admin") ,EditCourse);
router.get("/get",getAllCourseWithoutPurchased);
router.get("/get/:id",getSingleCourseWithoutPurchased);
router.get("/get-purchased",isAuthenticated,getUserCourses);
router.get("/get-content/:id",isAuthenticated,getcousebyUser);
router.put("/add-question",isAuthenticated,AddQuestion);
router.put("/add-answer",isAuthenticated,AddAnswer)
router.put("/add-review/:id",isAuthenticated,AddReview)
router.put("/add-reply",isAuthenticated,authorizeRoles("admin"),addReplytoReview)
router.get("/get-all",isAuthenticated,authorizeRoles("admin"),getAllCourse);
router.delete("/delete",isAuthenticated,authorizeRoles("admin"),deleteCourse);
router.put("/upload",isAuthenticated,authorizeRoles("admin"),UploadThumbnail);

export default router;