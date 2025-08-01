import { v2 as cloudinary } from 'cloudinary';

import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';

export const createPost = async(req, res) => {
    try {
        const {text} = req.body;
        let {img} = req.body;

        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        };

        if(!text && !img){
            return res.status(400).json({error: "Post must have text or image"});
        };

        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }


        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("Error in createPost controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        };

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized User"});
        };

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0]; // fjsdlfjsdl/jskdfslk/jkfsdjlk/jslfsdk.123
            await cloudinary.uploader.destroy(imgId);
        };

        await Post.findByIdAndDelete(post._id);

        res.status(200).json({message: "Deleted post successfully"});

    } catch (error) {
        console.log("Error in deleting post controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const commentOnPost = async(req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({error: "Text field is required"});
        };

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        };

        const comment = {user: userId, text};

        post.comments.push(comment);
        await post.save();
        
        res.status(200).json(post);
    } catch (error) {
        console.log("Error in adding comment controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const likeUnlikePost = async(req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        };

        const userLikedPost = post.likes.includes(userId); // user already liked
        if(userLikedPost){
            //Unliked the post
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likePosts: postId}});
            
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());

            res.status(200).json(updatedLikes);

        } else {
            //like the post
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likePosts: postId}});

            await post.save();

            const notification = new Notification({
                type: "like",
                from: userId,
                to: post.user
            });
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("Error in like/unlike post controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getAllPosts = async(req,res) => {
    try {
        const posts = await Post.find()
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })

        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getLikedPosts = async(req, res) => {
    const userId = req.params.id;
    try {

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        };

        const likedPosts = await Post.find({_id : {$in: user.likePosts}})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikedPosts conteoller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getFollowingPosts = async(req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        };

        const following = user.following;

        const followingPosts = await Post.find({user : {$in: following}})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(followingPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts", error.message);
        res.status(500).json({error: "internal server error"});
    }
};

export const getUserPosts = async(req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User not found"});
        };

        const userPosts = await Post.find({user: user._id})
            .sort({createdAt: -1})
            .populate({
                path: 'user',
                select: "-password"
            })
            .populate({
                path: 'comments.user',
                select: "-password"
            });

        res.status(200).json(userPosts);

    } catch (error) {
        console.log("Error in getUserPosts", error.message);
        res.status(500).json({error: "internal server error"});
    }
};