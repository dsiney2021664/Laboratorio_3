import { response, request } from "express";
import Post from './post.model.js';
import Comment from '../comment/comment.model.js';

export const getPosts = async (req = request, res = response) => {
    try {
        const posts = await Post.find({ state: true }).populate('createdBy', 'email');
        for (const post of posts) {
            const comments = await Comment.find({ post: post._id }).populate('createdBy', 'email');
            post.comments = comments;
        }
        res.status(200).json({
            posts,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
}

export const createPost = async (req, res = response) => {
    const { title, category, mainText } = req.body;
    const createdBy = req.user.id;

    try {
        const post = new Post({ title, category, mainText, createdBy });
        await post.save();
        res.status(201).json({
            msg: 'Post created successfully',
            post
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

export const updatePost = async (req, res = response) => {
    const { id } = req.params;
    const { title, category, mainText } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }

        if (String(post.createdBy) !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized access' });
        }

        post.title = title;
        post.category = category;
        post.mainText = mainText;
        await post.save();

        res.status(200).json({
            msg: 'Post updated successfully',
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

export const deletePost = async (req, res = response) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (String(post.createdBy) !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized access' });
        }

        post.state = false; 
        await post.save();

        res.status(200).json({
            msg: 'Post deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
