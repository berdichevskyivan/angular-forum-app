const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');
const PostModel = require('./models/PostModel');

(async()=>{
    await mongoose.connect('mongodb://localhost/forumApp',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})();

const express = require('express');
const session = require('express-session');

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
    // create new redis store
    store: new redisStore({host:'localhost',post:6379,client:client,ttl:260}),
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { expires: 20 * 1000}, // 8 hours
    maxAge: 8*60*60*1000,
}));

app.use(function(req,res,next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})

app.get('/api/validateSession',function(req,res){
    let sess = req.session;
    console.log('/api/validateSession is being called');
    if(sess.username){
        // means session is valid
        res.send({
            type:'success',
            message:'Session is valid',
            username: sess.username,
        })
    }else{
        res.send({
            type:'error',
            message:'Session is invalid',
        })
    }
})

app.post('/api/login',function(req,res){
    console.log('/api/login is being called');
    console.log(req.body);
    UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
        if (err) return console.log(err);
        console.log(docs);
        // it did NOT find the user
        if(docs.length===0){
            let response = {
                message:'The user was not found',
                type:'error',
            }
            console.log(response);
            res.send(response);
        }else{
            // it did find the user!
            // by assigning a property to the session, Session is initiated and SessionID is fixed until destroyed
            req.session.username = req.body.username;
            let response = {
                message:'Credentials are correct. User was found',
                type:'success',
            }
            console.log(response);
            res.send(response);
        }
    })
})

app.get('/api/logout',function(req,res){
    console.log('/api/logout is being called. Session will get destroyed...');
    req.session.destroy((err)=>{
        if(err) return console.log(err);
        console.log('Session destroyed');
    });
});

app.post('/api/register',function(req,res){
    console.log('/api/register is being called');
    console.log(req.body);
    // first we will check if user already exists
    UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
        if (err) return console.log(err);
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
                }
                res.send(response);
            })
            // Logging the user into the session
            req.session.username = req.body.username;
        }else{
            // it did find the user!
            let response = {
                message:'User already exists',
                type:'error',
            }
            res.send(response);
        }
    })
})

app.post('/api/savePost', function(req,res){
    let sess = req.session;
    if(sess.username){
        console.log('/api/savePost is being called');
        let newPost = new PostModel();
        newPost.postUser = sess.username;
        newPost.postContent = req.body.postContent;
        newPost.postComments = [];
        newPost.save(function(err){
            if(err) return console.log(err);
            let response = {
                message:'Post was saved successfully',
                type:'success',
            }
            res.send(response);
        })
    }else{
        res.send({
            type:'error',
            message:'Please login first'
        })
    }

})

app.post('/api/saveComment', function(req,res){
    console.log('/api/saveComment is being called');
    console.log(req.body);
    let sess = req.session;
    if(sess.username){
        // first must find the Post , must retrieve all its comments , then push the new comment, then update    
        PostModel.find({ _id:req.body.postId },(err,docs)=>{
            if(err) return console.log(err);
            let newComments = [...docs[0].postComments]
            let postComment = req.body.postComment;
            postComment.postCommentAuthor = sess.username;
            newComments.push(req.body.postComment);
            PostModel.update({ _id:req.body.postId },{ postComments:newComments },null,function(err,response){
                if(err) return console.log(err);
                res.send({
                    message:'All went good!',
                    type:'success',
                })
            });
        })
    }else{
        res.send({
            type:'error',
            message:'Please login first'
        })
    }

})

app.get('/api/posts',function(req,res){
    console.log('GET /api/posts is being called');
    PostModel.find({},(err,docs)=>{
        if(err) return console.log(err);
        res.send(docs);
    })
})

app.listen(9000,()=>{
    console.log('listening on port 9000');
})