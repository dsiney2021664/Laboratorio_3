import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    mainText: {
        type: String,
        required: [true, "Main text is required"]
    },
    state: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

export default mongoose.model('Post', PostSchema);