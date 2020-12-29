const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');
const PostModel = require('./models/PostModel');

const express = require('express');
const session = require('express-session');

const cors = require('cors');

const redis = require('redis');
const redisStore = require('connect-redis')(session);

const client = redis.createClient();

const { update } = require('./models/UserModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

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

app.get('/api/validateSession',function(req,res){
    console.log('/api/validateSession is being called');
    console.log(req.session);
    if(req.session.username){
        // means session is valid
        res.send({
            type:'success',
            message:'Session is valid',
            username: req.session.username,
        })
    }else{
        res.send({
            type:'error',
            message:'Session is invalid',
        })
    }
});

app.post('/api/login',function(req,res){
    console.log('/api/login is being called');
    console.log(req.body);
    UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
        if (err){
            return console.log(err);
        } else {
            console.log(docs);
            // it did NOT find the user
            if(docs.length===0){
                let response = {
                    message:'The user was not found',
                    type:'error',
                };
                console.log(response);
                res.send(response);
            }else{
                // it did find the user!
                // by assigning a property to the session, Session is initiated and SessionID is fixed until destroyed
                req.session.username = req.body.username;
                console.log(req.session);
                let response = {
                    message:'Credentials are correct. User was found',
                    type:'success',
                };
                console.log(response);
                res.send(response);
            }
        }

    })
});

app.get('/api/logout',function(req,res){
    console.log('/api/logout is being called. Session will get destroyed...');
    req.session.destroy((err)=>{
        if(err) return console.log(err);
        console.log('Session destroyed');
        res.send({
            type:'success',
            message:'Logged out correctly',
        })
    });
});

app.post('/api/register',function(req,res){
    console.log('/api/register is being called');
    console.log(req.body);
    // first we will check if user already exists
    UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
        if (err){
            return console.log(err);
        } else {
            console.log(docs);
            // it did NOT find the user
            if(docs.length===0){
                let newUser = new UserModel();
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.save(function(err){
                    if(err) return console.log(err)
                    let response = {
                        message:'User created!',
                        type:'success',
                        username: req.body.username,
                    };
                    res.send(response);
                });
                // Logging the user into the session
                req.session.username = req.body.username;
            }else{
                // it did find the user!
                let response = {
                    message:'User already exists',
                    type:'error',
                };
                res.send(response);
            }
        }

    })
});

app.post('/api/savePost', function(req,res){

    if(req.session.username){

        console.log('/api/savePost is being called');
        let newPost = new PostModel();
        newPost.title = req.body.title;
        newPost.content = req.body.content;
        newPost.author = req.body.author;
        newPost.creationDate = new Date(Date.now());
        newPost.comments = [];
        newPost.save(function(err){
            if(err) return console.log(err);
            let response = {
                message:'Post was saved successfully',
                type:'success',
            };
            res.send(response);
        })

    }else{

        res.send({
            type:'error',
            message:'Please login first'
        })

    }

});

app.post('/api/saveComment', function(req,res){
    console.log('/api/saveComment is being called');
    console.log(req.body);
    if(req.session.username){
        // first must find the Post , must retrieve all its comments , then push the new comment, then update    
        PostModel.find({ _id:req.body.postId },(err,docs)=>{
            if(err) return console.log(err);
            let newComments = [...docs[0].comments]
            let postComment = { };
            postComment.author = req.body.author;
            postComment.content = req.body.content;
            newComments.push( postComment );
            PostModel.update({ _id:req.body.postId },{ comments:newComments }, null, function(err,response){
                if (err){
                    console.log(err);
                } else {
                    res.send({
                        message:'All went good!',
                        type:'success',
                    })
                }
            });
        })
    }else{
        res.send({
            type:'error',
            message:'Please login first'
        })
    }

});

app.get('/api/posts',function(req,res){
    console.log('GET /api/posts is being called');
    PostModel.find({},(err,docs)=>{
        if(err) return console.log(err);
        res.send(docs);
    })
});

app.listen(9000,()=>{
    console.log('listening on port 9000');
});
