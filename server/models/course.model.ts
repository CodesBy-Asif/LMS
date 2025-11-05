import mongoose, {Document,Schema,Model} from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document{
    user:Object,
    comment:String
    commentreplies:Object
}
 export interface IQuestion extends Document{
    user:IUser,
    question:String
questionreplies:[Object]
}
interface IReview extends Document {
    user:IUser,
    ratting:number,
    comment:string
    commentreplies:IComment[]
}
interface ILink extends Document{
    title:string,
    url:string
}

interface ICourseData extends Document{
    title: string,
    description: string,
    videoUrl: string,
    thumbnail: Object,
    videoSection: string,
    videolenght: string,
    videoPlayer: string,
    links: ILink[],
    suggestions: string,
    questions: IQuestion[],
    
}
interface ICourse extends Document  {
  
name:string,
description:string,
price:number,
estimatedPrice:number,
thumbnail:object,
tags:string,
level:string,
demoUrl:string,
banifets:{title:string}[],
prerequisites:{title:string}[],
reviews:IReview[],
courseData:ICourseData[],
ratting?:number,
purchased?:Number,
}

const reviewShema = new Schema<IReview>({
    user:Object,
    ratting:{
        type:Number,
        default:0
    },
    comment:String,
    commentreplies:[Object]
})

const linksSchema = new Schema<ILink>({
    title:String,
    url:String
})

const commentSchema = new Schema<IComment>({
    user:Object,
    comment:String,
    commentreplies:Object,
})
const questionSchema = new Schema<IQuestion>({
    user:Object,
    question:String,
    questionreplies:Object,
})

const courseDataSchema = new Schema<ICourseData>({
    title: String,
    description: String,
    videoUrl: String,
    videoSection: String,
    thumbnail: Object,
    videolenght: Number,
    videoPlayer: String,
    links: [linksSchema],
    suggestions: String,
    questions: [questionSchema],
})

const courseSchema = new Schema<ICourse>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    estimatedPrice:{
        type:Number,
    },
    thumbnail:{
        public_id:{
            required:true,
            type:String
        },
        url:{
            required:true,
            type:String
        }
    },
    tags:{
        type:String,
        required:true,
    },
    level:{
        type:String,
        required:true,
    },
    demoUrl:{ 
        type:String,
        required:true,
    },
    banifets:[{title:{type:String}}],
    prerequisites:[{title:{type:String}}],
    reviews:[reviewShema],
    courseData:[courseDataSchema],
    ratting:{
        type:Number,
        default:0
    },
    purchased:{
        type:Number,
        default:0
    }
},{timestamps:true})
const Course:Model<ICourse> = mongoose.model("Course",courseSchema);
export default Course;
