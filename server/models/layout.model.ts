import mongoose from "mongoose";
import { Schema,Model,Document } from "mongoose";

interface IFaq extends Document{
    question:string,
    answer:string
}

interface Icategory extends Document{
    title:string}

    interface Ibanner extends Document{
    public_id:string,
    url:string
}

interface ILayout extends Document{
    type:string,
    faqs:IFaq[],
    categories:Icategory[],
    banner:{
        image:Ibanner,
        title:string,
        subtitle:string
    }
}

const FaqSchema = new Schema<IFaq>({
    question:{
        type:String,
     
    },
    answer:{
        type:String,
     
    }
})

const CategorySchema = new Schema<Icategory>({
    title:{
        type:String,
     
    }
})

const BannerSchema = new Schema<Ibanner>({
    public_id:{
        type:String,
     
    },
    url:{
        type:String,
     
    }
})

const LayoutSchema = new Schema<ILayout>({
    type:{
        type:String,
     
    },
    faqs:[FaqSchema],
    categories:[CategorySchema],
    banner:{
        image:BannerSchema,
        title:{
            type:String,
         
        },
        subtitle:{
            type:String,
         
        }
    }

})

const Layout:Model<ILayout> = mongoose.model("Layout",LayoutSchema);
export default Layout;
        
    
