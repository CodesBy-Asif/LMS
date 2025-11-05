
require('dotenv').config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import redis from "./redis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    secure?: boolean;
    sameSite: "lax" | "strict" | "none"| undefined;
}
 const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ||'300') 
    const refresTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN||'1')// 15 minutes

  export  const accessOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpires * 60* 1000),
        maxAge: accessTokenExpires*60*1000,
        httpOnly: true,
        sameSite: "none",
    };
  export  const refreshOptions: ITokenOptions = {
        expires: new Date(Date.now() + refresTokenExpires* 24 * 60 * 60 * 1000),
        maxAge: refresTokenExpires*24*60* 60*1000,
        httpOnly: true,
        sameSite: "none",
    };
export  const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const acessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    redis.set(user._id, JSON.stringify(user)as any); // 7 days expiration

   


    if (process.env.NODE_ENV === "production") {
        accessOptions.secure = true;
    }

    res.cookie("access_Token", acessToken, accessOptions);
    res.cookie("refresh_Token", refreshToken, refreshOptions);
    res.status(statusCode).json({
        success: true,
        user,
        acessToken,
    });
};


