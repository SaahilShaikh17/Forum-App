const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');

// Create a new comment for a specific post
const createComment = async (req, res) => {
    const { postId } = req.params; 
    const { commentText } = req.body;
    console.log(postId);
    // Check if commentText exists
    if (!commentText) {
        return res.status(400).json({ message: 'Enter your comment!' });
    }

    try {
        // // Ensure postId is a valid ObjectId
        // if (!String(mongoose.Types.ObjectId).isValid(postId)) {
        //     return res.status(400).json({ message: 'Invalid post ID' });
        // }

        // Find the author of the comment
        const author = await User.findOne({ username: req.user.id }).exec();
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        // Find the post
        const post = await Post.findById(postId).populate('author', 'username').exec();
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create the comment
        const newComment = await Comment.create({
            post: postId,
            comment: commentText,
            author: author._id
        });

        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create comment', error: error.message });
    }
};

const updateComment = async(req,res) =>{
    const { id } = req.params;
    const { commentText } = req.body;
    const author = await User.findOne({username: req.user.id}).exec();
    const userId = author._id;
    try{
        const comment = await Comment.findById(id).exec();
        if(!comment) res.status(404).json({'message': 'Comment Not Found'});
        // console.log(comment.author._id);
        // console.log(comment.author);
        if(String(comment.author) !== String(userId)) return res.status(403).json({'message':'You are not authorized to update this comment'});

        comment.comment = commentText;
        const result =await comment.save();
        res.json(result);

    }catch(err){
        res.status(400).json({ message: err.message });
    }

};


const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the authenticated user
        const author = await User.findOne({ username: req.user.id });
        if (!author) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the comment by ID
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Ensure the authenticated user is the author of the comment
        if (String(comment.author) !== String(author._id)) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        // If all checks pass, remove the comment
        await Comment.deleteOne({ _id: id });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
};


const getCommentsForPost = async (req, res) => {
    const { postId } = req.params;
    
    try {
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.json({ comments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
};


module.exports = { createComment, updateComment, deleteComment, getCommentsForPost };