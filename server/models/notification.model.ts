import mongoose,{Document,Model,Schema} from 'mongoose';

interface INotification extends Document{
    title:string
    message:String,
    status:String,
    userId:String}

    const notificationSchema = new Schema<INotification>({
        title:{
            type:String,
            required:true,
        },
        message:{
            type:String,
            required:true,
        },
        status:{
            type:String,
            required:true,
            default:"unread"
        },
        userId:{
            type:String,
            required:true,
        }
    },{timestamps:true});
    const Notification:Model<INotification> = mongoose.model("Notification",notificationSchema);
    export default Notification;