import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    article:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Article",
        required:true
    },

    text:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

export default mongoose.model("Comment",commentSchema);