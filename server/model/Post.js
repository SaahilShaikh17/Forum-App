const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 80,
      },
       description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      upvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
      comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }],
      time: {
        type: Date,
        default: Date.now,
      }
});

module.exports = mongoose.model('Post', postSchema);