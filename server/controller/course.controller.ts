import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.servies";
import Course from "../models/course.model";
import redis from "../utils/redis";
import { Types } from "mongoose";
import Notification from "../models/notification.model";

import sendMail from "../utils/sendmail";

// Uplaod a course
export const UploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
     
    try {
      const data = req.body;
   
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courseThumbnails",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res);
    } catch (error: any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);
export const UploadThumbnail = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { thumbnail, oldThumbnail } = req.body;

      if (!thumbnail) {
        return next(new ErorHandler("No thumbnail provided", 400));
      }

      // Delete old thumbnail if provided
      if (oldThumbnail && oldThumbnail.public_id) {
        await cloudinary.v2.uploader.destroy(oldThumbnail.public_id);
      }

      // Upload new thumbnail
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courseThumbnails",
      });

      res.status(200).json({
        success: true,
        message: "Thumbnail uploaded successfully",
        thumbnail: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
    } catch (error: any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);
export const EditCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
  
      const courseId = req.params.id;
  
      const courseData = (await Course.findById(courseId)) as any;
      if (typeof thumbnail === "string") {
        
        await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      
      const course = await Course.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );
      console.log(course)
      if (redis) {
        await redis.del(`${courseId}`);
        await redis.del("Allcourse");
      }
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error:any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);


// get single course witout Purchased
export const getSingleCourseWithoutPurchased = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const IsChache = await redis.get(courseId);
      if (IsChache) {
        res.status(200).json({
          success: true,
          course: JSON.parse(IsChache),
        });
      } else {
        const course = await Course.findById(courseId).select(
          "-courseData.videoUrl -courseData.links -courseData.questions -courseData.videoPlayer -courseData.suggestions -suggestions "
        );
        await redis.set(courseId, JSON.stringify(course),"EX",60*60*24*7);
        if (!course) {
          return next(new ErorHandler("Course not found", 404));
        }
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErorHandler(error.message, 500));
    }
  }
);
// get all course without Purchased
export const getAllCourseWithoutPurchased = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const IsChache = await redis.get("Allcourse");
      if (IsChache) {
        res.status(200).json({
          success: true,
          courses: JSON.parse(IsChache),
        });
      } else {
        const courses = await Course.find().select(
          "-courseData.videoUrl -courseData.links -courseData.questions -courseData.videoPlayer -courseData.suggestions -suggestions "
        );
        await redis.set("Allcourse", JSON.stringify(courses));

        if (!courses) {
          return next(new ErorHandler("Courses not found", 404));
        }
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErorHandler(error.message, 500));
    }
  }
);

export const getcousebyUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = courseList?.find(
        (course) => course._id.toString() === courseId
      );
      if(req.user?.role === "admin"){
        const course = await Course.findById(courseId);
        if (!course) {
          return next(new ErorHandler("Course not found", 404));
        }
        res.status(200).json({
          success: true,
          content: course.courseData,
        });
        return;
      }
      if (!courseExist) {
        return next(new ErorHandler("You have not purchased this course", 403));
      }
      const course = await Course.findById(courseId);
      if (!course) {
        return next(new ErorHandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        content: course.courseData,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErorHandler(error.message, 500));
    }
  }
);

export const getUserCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCoursesList = req.user?.courses;

      if (!userCoursesList) {
        return next(new ErorHandler("You have not purchased any course", 403));
      }

      const courses = await Course.find({
        _id: {
          $in: userCoursesList.map((course: any) => course._id),
        },
      });

      if (!courses) {
        return next(new ErorHandler("Courses not found", 404));
      }

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErorHandler(error.message, 500));
    }
  }
);

     
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const AddQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      if (!question || !courseId || !contentId) {
        return next(new ErorHandler("Please provide all required fields", 400));
      }

      const course = await Course.findById(courseId.toString());
      if (!course) {
        return next(new ErorHandler("Course not found", 404));
      }

      if (!Types.ObjectId.isValid(contentId)) {
        return next(new ErorHandler("Invalid content ID", 400));
      }

      const content = course.courseData.find((content: any) =>
        content._id.equals(contentId)
      );

      if (!content) {
        return next(new ErorHandler("Content not found in the course", 404));
      }
      if (!req.user) {
        return next(new ErorHandler("User not authenticated", 401));
      }

      const newQuestion: any = {
        user: req.user,
        question,
        questionreplies: [],
      };

      content.questions.push(newQuestion);
await Notification.create({
        userId: req.user._id,
        title: "New Question",
        message: `${req.user.name} has added a new question in ${content.title}`,
})
      await course.save();

      res.status(201).json({
        success: true,
        message: "Question added successfully",
        question: newQuestion,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErorHandler(error.message, 500));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  questionId: string;
  courseId: string;
  contentId: string;
}

export const AddAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const { answer, questionId, courseId, contentId }: IAddAnswerData =
        req.body;
      if (!answer || !questionId || !courseId || !contentId) {
        return next(new ErorHandler("Please provide all required fields", 400));
      }

      const course = await Course.findById(courseId);

      if (!Types.ObjectId.isValid(contentId)) {
        return next(new ErorHandler("Invalid content ID", 400));
      }
      const content = course?.courseData.find((content: any) =>
        content._id.equals(contentId)
      );
      if (!content) {
        return next(new ErorHandler("Content not found in the course", 404));
      }
      const question = content.questions.find((q: any) =>
        q._id.equals(questionId)
      );
      if (!question) {
        return next(new ErorHandler("Question not found", 404));
      }
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionreplies.push(newAnswer);
     course?.markModified("courseData");
      await course?.save();

      if (req.user?._id === question.user._id.toString()) {
        await Notification.create({
        userId: req.user._id,
        title: "new Question Reply received",
        message: `${req.user.name} has replied to your question in ${content.title}`,
         });
      } else {
        const data = {
          name: req.user?.name,
          title: content.title,
        };
        try {
          await sendMail({
            to: question.user.email,
            subject: "New Answer to Your Question",
            template: "quesstionReplay",
            data,
          });
        } catch (error: any) {
          return next(new ErorHandler(error.message, 500));
        }
      }
      res.status(200).json({
        success: true,
        newAnswer,
      });
    } catch (error: any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);

interface IAddReview {
  review: string;
  courseId: string;
  ratting: number;
  userId: string;
}

export const AddReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );
      if (!courseExist) {
        return next(new ErorHandler("Not Eligible", 401));
      }

      const course = await Course.findById(courseId);
      const { review, ratting } = req.body;
const exist = course?.reviews?.some(review => review.user._id.toString() === req.user?._id.toString());
if(exist){
        return next(new ErorHandler("Already reviewed", 400));
 }
      const reviewData: any = {
        user: req.user,
        comment: review,
        ratting,
      };

      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.ratting;
      });
      if (course) {
        course.ratting = avg / course?.reviews.length;
      }
      await course?.save();
        await redis.del(course?.id)
      const notification = {
        title: "new review received",
        message: req.user?.name + " has giving a review in " + course?.name,
      };
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);

interface IAddReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplytoReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, reviewId, courseId } = req.body as IAddReplyData;
      if (!comment || !reviewId || !courseId) {
        return next(new ErorHandler("Please provide all required fields", 400));
      }

      const course = await Course.findById(courseId);

      if (!course) {
        return next(new ErorHandler("Course not found", 404));
      }

      const review = course?.reviews.find((rev: any) =>
        rev._id.equals(reviewId)
      );
      if (!review) {
        return next(new ErorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };

      review.commentreplies.push(replyData);

      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErorHandler(error.message, 500));
    }
  }
);

export const getAllCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            courses
        })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})

export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return next(new ErorHandler("Please provide all required fields", 400));
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new ErorHandler("Course not found", 404));
        }
                await course.deleteOne({id:courseId});

        const courses = await Course.find().select(
          "-courseData.videoUrl -courseData.links -courseData.questions -courseData.videoPlayer -courseData.suggestions -suggestions "
        );
        await redis.set("Allcourse", JSON.stringify(courses));
        await redis.del(courseId);
        res.status(201).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})