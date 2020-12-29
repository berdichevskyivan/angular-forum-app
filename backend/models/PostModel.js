const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    content: String,
    author: String,
    creationDate: Date,
    comments: Array,
});

const PostModel = mongoose.model('Post',PostSchema);

module.exports = PostModel;
