import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    summary:{
        type:String
    },

    image:{
        type:String
    },

    url:{
        type:String,
        required:true,
        unique:true
    },

    source:{
        type:String
    },

    category:{
        type:String
    },

    publishedAt:{
        type:Date
    },

    author:{
        type:String
    },

    views:{
        type:Number,
        default:0
    },

likeCount:{
        type:Number,
        default:0
    }
    

},{
    timestamps:true
});

articleSchema.index({title:"text",summary:"text"});

articleSchema.index({ publishedAt: -1 });
articleSchema.index({ likeCount: -1, publishedAt: -1 });

export default mongoose.model("Article",articleSchema);