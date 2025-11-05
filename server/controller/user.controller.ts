import { User } from "../models/user.model";
import { IUser }from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";


require('dotenv').config();
import sendMail from "../utils/sendmail";
import { accessOptions, refreshOptions, sendToken } from "../utils/jwt";
import redis from "../utils/redis";
import {getuserbyId} from "../services/getuserbyId";

interface IRegisterBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

interface IActivationRequest {
    activationcode: string;
    token: string;
}

interface ILoginBody {
    email: string;
    password: string;
}

interface IActivationToken {
    token: string;
    activationcode: string;
}

interface IUpdateUserInfo {
    email: string;
    name: string;
}

interface IupdateUserPassword {
    oldPassword: string;
    newPassword: string;
}

export const register =CatchAsyncError(async (req: Request<{}, {}, IRegisterBody>, res: Response,next:NextFunction) => {
    try {
        const { name, email, password, avatar } = req.body; 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next (new ErorHandler("User already exists", 400));
        }
     
        const newUser = new User({
            name,
            email,
            password,
        });
        const activationtoken = CreateActivationToken(newUser);
        const code = activationtoken.activationcode;

        const data = {user:{ name: newUser.name},activationcode: code};
//send mail and onwaord remaining
        try {
          await  sendMail({
                to: newUser.email,
                subject: "Account Activation Code",
                template: 'activation',
                data,
            });

            res.status(200).json({ success: true, message: "Activation email sent",
                activationtoken: activationtoken.token
             });
        } catch (error) {
            console.error("Error sending email:", error);
            return next(new ErorHandler("Failed to send activation email", 500));
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export const CreateActivationToken = (user:any):IActivationToken => { 
    const activationcode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationcode }, process.env.ACTIVATION_SECRET_KEY as string, {
        expiresIn: '5m'
    });
    return { token, activationcode };
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { activationcode, token }: IActivationRequest = req.body;
        if (!activationcode || !token) {
            return next(new ErorHandler("Invalid request", 400));
        }
        const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET_KEY as string) as { user: IUser; activationcode: string };

        if (decoded.activationcode !== activationcode) {
            return next(new ErorHandler("Invalid or expired activation code", 400));
        }
        const { name, email, password } = decoded.user;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErorHandler("User already exists", 400));
        }  

        const newUser = new User({
            name,
            email,
            password,
            isVerified: true,
        });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: "Account activated successfully",
        });
    } catch (error:any) {
       return next(new ErorHandler(error.message, 400));
    }
});

export const login = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { email, password }: ILoginBody = req.body;
        if (!email || !password) {
            return next(new ErorHandler("Please provide email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErorHandler("Invalid email or password", 401));
        }
        const isPasswordValid =await user.comparePassword(password);
   
        if (!isPasswordValid) {
            return next(new ErorHandler("Invalid email or password", 401));
        }
user.password=undefined as any;
        sendToken(user, 200, res);
    } catch (error:any) {
        return next(new ErorHandler(error.message, 400));
    }   
});

export const logout = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
const  userID = req.user?._id||"";
        try {
          
          await redis.del(userID);
  res.clearCookie("access_Token");
            res.clearCookie("refresh_Token");

            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error:any) {
            return next(new ErorHandler(error.message, 400));
        }
});

export const updateAcesstoken = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
    const refreshToken = req.cookies.refresh_Token;
    if (!refreshToken) {
        return next(new ErorHandler("Please login now!", 400));
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY as string) as JwtPayload;
    if (!decoded || !decoded.id) {
        return next(new ErorHandler("Invalid refresh token, please login again", 401));
    }

    const session = await redis.get(decoded.id);

    if (!session) {
        return next(new ErorHandler("Session expired, please login again", 400));
    }

    const user :IUser = JSON.parse(session);
    const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_SECRET_KEY as string, {
        expiresIn: "5m",
    });

    const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY as string, {
        expiresIn: "3d",
    });

    await redis.set(user._id, JSON.stringify(user)as any); 
if (!newAccessToken) {
    return next(new ErorHandler("Could not create new access token", 500));
}
res.cookie("access_Token", newAccessToken, accessOptions);
res.cookie("refresh_Token", newRefreshToken, refreshOptions);

redis.set(user._id, JSON.stringify(user),"EX",60*60*24*7);
    res.status(200).json({
        success: true,
        access_Token: newAccessToken,   
        
    });
});

export const getMyProfile = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
    try {
        const userId = req.user?._id
        if (userId){
      await getuserbyId(userId,res)
        }
    }catch (error:any){
        return next(new ErorHandler(error.message, 400));
    }
});

export const socialLogin = CatchAsyncError(async (req: Request, res: Response,next:NextFunction) => {
    try {
    const { email, avatar, name } = req.body;
    if (!email) {
        return next(new ErorHandler("Email is required", 400));
    }
    let user = await User.findOne({ email });
    if (!user) {
       
       const newuser = await User.create({
            name: name ,
            email,
            avatar,
            isVerified: true,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10), // Generate a random
       });
    await newuser.save();  
          sendToken(newuser, 200, res);
    }
    else {
        sendToken(user, 200, res);
    }
} catch (error:any) {
    return next(new ErorHandler(error.message, 400));
}
});

export const updateUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name } = req.body as IUpdateUserInfo;
            const user_id = req.user?._id;

            if (!user_id) {
                return next(new ErorHandler("Unauthorized access", 401));
            }

            const user = await User.findById(user_id);
            if (!user) {
                return next(new ErorHandler("User not found", 404));
            }

            if (email) {
                const isEmailExists = await User.findOne({ email, _id: { $ne: user_id } });
                if (isEmailExists) {
                    return next(new ErorHandler("Email already exists", 409));
                }
                user.email = email;
            }

            if (name) {
                user.name = name;
            }

            await user.save();

            // Update cache
            await redis.set(user_id.toString(), JSON.stringify(user));

            // Respond to client
            res.status(201).json({
                success: true,
                user,
            })
        } catch (error: any) {
            return next(new ErorHandler(error.message || "Server error", 500));
        }
    }
);
export const updateUserPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {oldPassword, newPassword} = req.body as IupdateUserPassword;
        const user = await User.findById(req.user?._id);
        if(!user) {
            return next(new ErorHandler("User not found", 401));
        }
        const Ispasswordmatch = await user?.comparePassword(oldPassword);
        if (!Ispasswordmatch) {
return next(new ErorHandler("invalid password", 401));
        }
        if(!user.password){
            return next (new ErorHandler("invalid User",401))
        }
        user.password= newPassword;

    }catch (e:any) {
        return next(new ErorHandler(e.message, 401));

    }
})



export const UpdateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body; // avatar should be base64 string or URL

    if (!avatar) {
        return next(new ErorHandler("No avatar provided", 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErorHandler("User not found", 404));
    }

    try {
        // Remove old avatar if exists
        if (user.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        // Upload new avatar
        const mycloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        user.avatar = {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        };

        await user.save();

        // Update Redis cache
        await redis.set(user._id.toString(), JSON.stringify(user));

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err: any) {
        return next(new ErorHandler(err.message || "Failed to update avatar", 500));
    }
});

export const getAllUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            users
        })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})

export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, userId } = req.body;
        if (!role || !userId) {
            return next(new ErorHandler("Please provide all required fields", 400));
        }
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErorHandler("User not found", 404));
        }
        user.role = role;
        await user.save();
        res.status(201).json({
            success: true,
            message: "User role updated successfully",
            user
        })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})

export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return next(new ErorHandler("Please provide all required fields", 400));
        }
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErorHandler("User not found", 404));
        }
        await user.deleteOne({id:userId});
        redis.del(userId);
        res.status(201).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error: any) {
        return next(new ErorHandler(error.message, 500));
    }
})