const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');
const PostModel = require('./models/PostModel');

const express = require('express');
const session = require('express-session');

const cors = require('cors');

const { update } = require('./models/UserModel');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors:{
        origin:'http://localhost:4200',
        methods: ['GET','POST'],
        credentials: true,
    }
});

// we initialize the session and we provide a secret
app.use(session({
    secret:'ssshhhh',
    saveUninitialized: true,
    resave: true,
}));

app.use(cors({
    origin:'http://localhost:4200',
    credentials: true,
}));

(async()=>{
    // We're connecting to our MongoDB Atlas Cluster Service in the cloud
    await mongoose.connect('mongodb+srv://forum-app:rPGjPnNsXXn4VEiy@cluster0.pflxk.mongodb.net/forumApp?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})();

io.on('connection',(socket) => {

    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // validateSession
    socket.on('validateSessionRequest', () => {
        let response = {};
        console.log('validateSessionRequest is being called');
        console.log(session);
        if(session.username){
            // means session is valid
            response = {
                type:'success',
                message:'Session is valid',
                username: session.username,
            }
        }else{
            response = {
                type:'error',
                message:'Session is invalid',
            }
        }
        socket.emit('validateSessionResponse', response);
    });

    // login
    socket.on('loginRequest', (authData) => {
        let response = {};
        console.log('loginRequest is being called');

        UserModel.find({username:authData.username,password:authData.password},(err,docs)=>{
            if (err){
                return console.log(err);
            } else {
                console.log(docs);
                // it did NOT find the user
                if(docs.length===0){
                    response = {
                        message:'The user was not found',
                        type:'error',
                    };
                    console.log(response);
                    socket.emit('loginResponse', response);
                }else{
                    // it did find the user!
                    // by assigning a property to the session, Session is initiated and SessionID is fixed until destroyed
                    session.username = authData.username;
                    console.log(session);
                    response = {
                        message:'Credentials are correct. User was found',
                        type:'success',
                    };
                    console.log(response);
                    socket.emit('loginResponse', response);
                }
            }

        });
    });

    // logout
    socket.on('logoutRequest', () => {

        let response = {};

        console.log('logoutRequest is being called. Session will get destroyed...');

        delete session.username;

        response = {
            type:'success',
            message:'Logged out correctly'
        };

        socket.emit('logoutResponse', response);

    });

    // register
    socket.on('registerRequest', (authData) => {
        let response = {};
        console.log('registerRequest is being called');

        // first we will check if user already exists
        UserModel.find({username:authData.username},(err,docs)=>{
            if (err){
                return console.log(err);
            } else {
                console.log(docs);
                // it did NOT find the user
                if(docs.length===0){
                    let newUser = new UserModel();
                    newUser.username = authData.username;
                    newUser.password = authData.password;
                    newUser.save(function(err){
                        if(err) return console.log(err)
                        response = {
                            message:'User created!',
                            type:'success',
                            username: authData.username,
                        };
                        socket.emit('registerResponse', response);
                    });
                    // Logging the user into the session
                    session.username = authData.username;
                }else{
                    // it did find the user!
                    response = {
                        message:'User already exists',
                        type:'error',
                    };
                    socket.emit('registerResponse', response);
                }
            }

        })
    });

    // savePost
    socket.on('savePostRequest', (post) => {

        console.log('savePostRequest is being called');

        let response = {};

        if(session.username){

            let newPost = new PostModel();
            newPost.title = post.title;
            newPost.content = post.content;
            newPost.author = post.author;
            newPost.creationDate = new Date(Date.now());
            newPost.comments = [];
            newPost.save(function(err){
                if(err) return console.log(err);
                response = {
                    message:'Post was saved successfully',
                    type:'success',
                };
                socket.emit('savePostResponse', response);

                PostModel.find({},(err,docs)=>{
                    if(err) return console.log(err);
                    io.emit('postsResponse', docs);
                })

            })

        }else{

            response = {
                type:'error',
                message:'Please login first'
            };

            socket.emit('savePostResponse', response);

        }

    });

    // saveComment
    socket.on('saveCommentRequest', (comment) => {
        let response = {};
        console.log('saveCommentRequest is being called');

        if(session.username){
            // first must find the Post , must retrieve all its comments , then push the new comment, then update
            PostModel.find({ _id:comment.postId },(err,docs)=>{
                if(err) return console.log(err);
                let newComments = [...docs[0].comments]
                let postComment = { };
                postComment.author = comment.author;
                postComment.content = comment.content;
                newComments.push( postComment );
                PostModel.update({ _id:comment.postId },{ comments:newComments }, null, function(err,response){
                    if (err){
                        console.log(err);
                    } else {
                        response = {
                            message:'All went good!',
                            type:'success',
                        };
                        socket.emit('saveCommentResponse', response);

                        PostModel.find({ _id: comment.postId },(err,docs)=>{
                            if (err) {
                                console.log(err);
                            } else {
                                io.emit('postResponse', docs[0]);
                                PostModel.find({},(err,docs)=>{
                                    if(err) return console.log(err);
                                    io.emit('postsResponse', docs);
                                })
                            }
                        })

                    }
                });
            })
        }else{
            response = {
                type:'error',
                message:'Please login first'
            };
            socket.emit('saveCommentResponse', response);
        }

    });

    // posts
    socket.on('postsRequest', () => {

        console.log('postsRequest is being called');

        PostModel.find({},(err,docs)=>{
            if(err) return console.log(err);
            socket.emit('postsResponse', docs);
        })

    });

    // post
    socket.on('postRequest', (postId) => {

        console.log('postRequest is being called');

        PostModel.find({ _id: postId },(err,docs)=>{
            if (err) {
                console.log(err);
            } else {
                socket.emit('postResponse', docs[0]);
            }
        })

    });

});

http.listen(3000,() => {
    console.log('WebSockets listening on Port 3000');
});
