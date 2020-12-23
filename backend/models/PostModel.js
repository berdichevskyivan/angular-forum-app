const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postUser: String,
    postContent: String,
    postComments: Array,
})

const PostModel = mongoose.model('Post',PostSchema);

module.exports = PostModel;