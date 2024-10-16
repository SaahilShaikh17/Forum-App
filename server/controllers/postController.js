const Post = require('../model/Post');
const User = require('../model/User');

//Get all posts 
const getAllposts = async (req,res) => {
    try {
        const posts = await Post.find().populate('author','username');
        if(!posts) return res.status(204).json({'message':'No posts found'});
        // console.log(posts);
         res.json(posts)
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

const createPost = async (req, res) => {
    const { title, description } = req.body;

    try {
        // Find the user by username to get their ObjectId
        const author = await User.findOne({ username: req.user.id }).exec();
        if (!author) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the post with the author set to their ObjectId
        const newPost = await Post.create({
            title,
            description,
            author: author._id // Set the author to the ObjectId of the user
        });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, description } = req.body;

    try {
        // Find the post by ID
        const post = await Post.findById(postId).populate('author','username').exec();
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const author = await User.findOne({ username: req.user.id }).exec();

        console.log(post.author._id)
        console.log(author._id);
        console.log(author.username)
        // Check if the authenticated user is the author of the post
        if (String(post.author._id) !== String(author._id)) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        // Update the post with the new title and description
        if (req.body?.title) post.title = title;
        if (req.body?.description) post.description = description;
        const updatedPost = await post.save();

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
};

const deletePost = async (req, res) => {
    const  postId  = req.params.id;
    try {
        const post = await Post.findOne({ _id: postId }).populate('author','username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const author = await User.findOne({username: req.user.id});
        // console.log(post.author._id);
        // console.log(author._id)
        // Check if the user is the author of the post
        if (String(post.author._id) !== String(author._id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await post.remove();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    const postId = req.params.id; // Get the postId from the URL parameters

    try {
        // Find the post by ID
        const post = await Post.findById(postId).populate('author', 'username').exec();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post found', post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get post', error: error.message });
    }
};

module.exports = {
    getAllposts,
    createPost,
    updatePost,
    deletePost,
    getPostById
}