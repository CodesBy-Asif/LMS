import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";
import Layout from "../models/layout.model";
import cloudinary from "cloudinary";

export const CreateLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {type} = req.body;
        const layoutExists = await Layout.findOne({type});
        if(layoutExists){
            return next(new ErorHandler("Layout already exists", 400));
        }
        if(type==="banner"){
            const {title,subtitle,image} = req.body;
            if(!title||!subtitle||!image){
                return next(new ErorHandler("Please provide all required fields", 400));
            }
            const data = await cloudinary.v2.uploader.upload(image,{
                folder:"banners",
            });
            const banner = { 
                image:{
                    public_id:data.public_id,
                    url:data.secure_url
                },
                title,
                subtitle
            }
            await Layout.create({type,banner});
        }

            if(type==="Faq"){
                const {faqs} = req.body;  
           
                await Layout.create({type,faqs});
            }
            if(type==="categories"){
                const {categories} = req.body;
                await Layout.create({type,categories});
            }
            res.status(201).json({
                success: true,
                message: "Layout created successfully",
            })
              
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
}); 

export const EditLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {type} = req.body;
        const layout = await Layout.findOne({type});
        if(!layout){
            return next(new ErorHandler("Layout not found", 404));
        }
        if(type==="banner"){
            const {title,subtitle,image} = req.body;
           await cloudinary.v2.uploader.destroy(layout.banner.image.public_id);
            const data = await cloudinary.v2.uploader.upload(image,{
                folder:"banners",
            });
            const banner = { 
                image:{
                    public_id:data.public_id,
                    url:data.secure_url
                },
                title,
                subtitle
            }
            await Layout.findOneAndUpdate({type},{$set:{banner}});
        }
    
        if(type==="Faq"){
            const {faqs} = req.body;              
           await Layout.findOneAndUpdate({type},{$set:{faqs}});
        }   
        if(type==="categories"){
            const {categories} = req.body;
            await Layout.findOneAndUpdate({type},{$set:{categories}});
        }
        res.status(201).json({
            success: true,
            message: "Layout updated successfully",
        })
              
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
});

export const getLayoutBytype = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
  const type = req.params.type;
        const layout = await Layout.findOne({type});
        if(!layout){
            return next(new ErorHandler("Layout not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Layout retrieved successfully",
            layout
        })
              
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
    
});