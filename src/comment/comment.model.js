import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        require: [true, "Comment must be required"],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Comment', CommentSchema);