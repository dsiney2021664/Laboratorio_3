import { response, request } from "express";
import Comment from './comment.model.js';
import Post from '../post/post.model.js'

export const getComment = async (req = request, res = response) => {
    const postId = req.query.postId;
    try {
        const comments = await Comment.find({ post: postId }).populate('createdBy', 'email');
        res.status(200).json({
            comments,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
}

export const createComment = async (req = request, res = response) => {
    const { content, postId } = req.body;
    const createdBy = req.user.id;

    try {
        const comment = new Comment({ content, post: postId, createdBy });
        await comment.save();

        const post = await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(201).json({
            msg: 'Comment created successfully',
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
export const updateComment = async (req, res = response) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                msg: 'Comment not found'
            });
        }

        if (String(comment.createdBy) !== req.user.id) {
            return res.status(404).json({
                msg: 'Unauthorized access'
            });
        }
        comment.content = content;
        await comment.save();

        res.status(200).json({
            msg: 'Comment updated successfully'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
}

export const deleteComment = async (req, res = response) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({
                msg: 'Comment not found'
            });
        }
        if (String(comment.createdBy) !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized access' });
        }
        res.status(200).json({
            msg: 'Comment deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

