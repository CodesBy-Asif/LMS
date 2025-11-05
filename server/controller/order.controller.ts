import { NextFunction, Request, Response } from "express";
import Order, { IOrder } from "../models/order.model";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";
import { User } from "../models/user.model";
import Course from "../models/course.model";
import sendMail from "../utils/sendmail";
import Notification from "../models/notification.model";
import { createOrder } from "../services/order.service";
import redis from "../utils/redis";
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

export const CreateOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ErorHandler("User not authenticated", 401));
    }

    const { courseId, paymentInfo } = req.body as IOrder;
    if (!courseId || !paymentInfo) {
        return next(new ErorHandler("Please provide all required fields", 400));
    }

    if('id' in paymentInfo){
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentInfo.id);
        if (paymentIntent.status !== 'succeeded') {
            return new ErorHandler("Payment not authorized  ", 200);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErorHandler("User not found", 404));
    }

    // Check if course already purchased
    const courseExist = user.courses.some(
        (course: any) => course._id.toString() === courseId.toString()
    );
    if (courseExist) {
        return next(new ErorHandler("You have already purchased this course", 403));
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ErorHandler("Course not found", 404));
    }

    // Create order
    const orderData: any = {
        courseId,
        userID: req.user._id,
    };
    const cId= course._id
    if(!cId){
        return next(new ErorHandler("Course not found", 404));
    }


    // Prepare mail data
    const data: any = {
        order: {
            _id: cId.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        },
    };

    // Send confirmation email
    await sendMail({
        to: req.user.email,
        subject: "New Order",
        template: "order",
        data,
    });

    // Update user
    user.courses.push({_id:cId.toString()});
  if(course.purchased){
        course.purchased =+ 1;

  }else{
        course.purchased = 1;

  }
await course.save();
  await user.save();

  await redis.set(req.user._id, JSON.stringify(user));
  await redis.set(cId.toString(), JSON.stringify(course));
    // Create notification
    await Notification.create({
        userId: user._id,
        title: "New Order",
        message: `${user.name} has placed an order for ${course.name}`,
    });

    await createOrder(orderData,res,next);

   
    }else{
        return next(new ErorHandler("Payment not authorized  ", 200));
    }
})

export const getAllOrder = CatchAsyncError(async (req:Request, res:Response,next:NextFunction) => {
  try {
  
const orders = await Order.aggregate([
  // convert string IDs to ObjectId
  {
    $addFields: {
      userObjId: { $toObjectId: "$userID" },
      courseObjId: { $toObjectId: "$courseId" },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userObjId",
      foreignField: "_id",
      as: "user",
      pipeline: [
        { $project: { name: 1, email: 1, _id: 1 } } // select only needed fields
      ],
    },
  },
  {
    $lookup: {
      from: "courses",
      localField: "courseObjId",
      foreignField: "_id",
      as: "course",
      pipeline: [
        { $project: { name: 1, price: 1, _id: 1 } } // select only needed fields
      ],
    },
  },
  { $unwind: "$user" },
  { $unwind: "$course" },
  { $sort: { createdAt: -1 } },
]);

res.status(200).json({
  success: true,
  orders,
});

  } catch (error) {
    next(new ErorHandler("erro",400))
  }
});


export const createPayment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
       const mypayment = await stripe.paymentIntents.create({
           amount: req.body.amount,
           currency: "USD",
           metadata: {
            company:"CodesByAsif",
            Course: req.body.product
           },
           automatic_payment_methods: {
               enabled: true,
           },
       })

       res.status(200).json({
           success: true,
           client_secret: mypayment.client_secret
       })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})