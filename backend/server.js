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

// this will save a user
// const userInstance = new UserModel();
// userInstance.username = 'akitsushima';
// userInstance.password = '12345';
// userInstance.save(function(err){
//     if (err) return console.log(err);
// })

const express = require('express');
const { update } = require('./models/UserModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(function(req,res,next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

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

app.get('/',function(req,res){
    console.log('im being called');
    res.send({
        msg:'hello im a message',
    })
})

app.get('/api/test',function(req,res){
    console.log('/api/test is being called');
    res.send({
        msg:'a different message this time'
    })
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
            res.send(response);
        }else{
            // it did find the user!
            let response = {
                message:'Credentials are correct. User was found',
                type:'success',
            }
            res.send(response);
        }
    })
})

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
                }
                res.send(response);
            })
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
    console.log('/api/savePost is being called');
    let newPost = new PostModel();
    newPost.postUser = req.body.postUser;
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
})

app.post('/api/saveComment', function(req,res){
    console.log('/api/saveComment is being called');
    console.log(req.body);
    // first must find the Post , must retrieve all its comments , then push the new comment, then update    
    PostModel.find({ _id:req.body.postId },(err,docs)=>{
        if(err) return console.log(err);
        let newComments = [...docs[0].postComments]
        newComments.push(req.body.postComment);
        PostModel.update({ _id:req.body.postId },{ postComments:newComments },null,function(err,response){
            if(err) return console.log(err);
            res.send({
                message:'All went good!',
                type:'success',
            })
        });
    })
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