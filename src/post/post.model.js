import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, "Title is required"],
    },
    category: {
        type: String,
        require: [true, "category is required"],
    },
    mainText: {
        type: String,
        require: [true, "main text is required"]
    },
    state: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Post', PostSchema);