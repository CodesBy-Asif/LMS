import mongoose,{Document,Model,Schema} from 'mongoose';

export interface IOrder extends Document {
    courseId: string;
    userID: string;
    paymentInfo:object;
}

const orderSchema = new Schema<IOrder>({
    courseId:{
        type:String,
        required:true,
    },
    userID:{
        type:String,
        required:true,
    },
    paymentInfo:{
        type:Object,
      //  required:true,
    },
}
,{timestamps:true});
 const Order:Model<IOrder> = mongoose.model("Orders",orderSchema);    
 export default Order;