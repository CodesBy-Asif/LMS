import mongoose ,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
require('dotenv').config();
import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document<string> {

    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses:Array<{
        _id: string;
}>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
    }

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: {
            validator: function (v: string) {
                return emailRegex.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses:[
        {   _id:{
            type:String,
            }
        }
    ]
}, {
    timestamps: true,
});

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next(); 

});
userSchema.methods.SignAccessToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.ACCESS_SECRET_KEY as string);
}
userSchema.methods.SignRefreshToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET_KEY as string);
}

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
