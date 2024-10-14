const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: true,
      },
      comment: {
        type: String,
        minlength: 3,
        maxlength: 5000,
      },
      author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      upvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
      time: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('Comment', commentSchema);
