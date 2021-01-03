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

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());

(async()=>{
    // We're connecting to our MongoDB Atlas Cluster Service in the cloud
    await mongoose.connect('mongodb+srv://forum-app:rPGjPnNsXXn4VEiy@cluster0.pflxk.mongodb.net/forumApp?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})();

app.post('/api/login',(req,res)=>{
    let response = {};
    console.log('/api/login is being called');

    UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
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
                res.send(response);
            }else{
                // it did find the user!
                // by assigning a property to the session, Session is initiated and SessionID is fixed until destroyed
                req.session.username = req.body.username;
                response = {
                    message:'Credentials are correct. User was found',
                    type:'success',
                    username: req.body.username,
                };
                res.send(response);
            }
        }

    });
});

app.get('/api/logout',(req,res)=>{
    console.log('/api/logout is being called');
    req.session.destroy((err)=>{
       if (err) {
           console.log(err);
       } else {
           response = {
               type:'success',
               message:'Logged out correctly'
           };

           res.send(response);
       }
    });

});

app.get('/api/validateSession',(req,res)=>{
    let response = {};
    console.log('/api/validateSession is being called');
    console.log(req.session);
    if(req.session.username){
        // means session is valid
        response = {
            type:'success',
            message:'Session is valid',
            username: req.session.username,
        }
    }else{
        response = {
            type:'error',
            message:'Session is invalid',
        }
    }
    res.send(response);
});

app.post('/api/register',(req,res)=>{
    let response = {};
    console.log('registerRequest is being called');

    // first we will check if user already exists
    UserModel.find({username:req.body.username},(err,docs)=>{
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
                    response = {
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
                response = {
                    message:'User already exists',
                    type:'error',
                };
                res.send(response);
            }
        }

    })
});

app.get('/api/posts',(req,res)=>{
    console.log('postsRequest is being called');

    PostModel.find({},(err,docs)=>{
        if(err) return console.log(err);
        res.send(docs);
    })
});

app.post('/api/post',(req,res)=>{
    console.log('postRequest is being called');

    PostModel.find({ _id: req.body.postId },(err,docs)=>{
        if (err) {
            console.log(err);
        } else {
            res.send(docs[0]);
        }
    })
});

// this maybe can be handled only by socket io service
app.post('/api/savePost',(req,res)=>{
    console.log('/api/savePost is being called');

    let response = {};

    if(req.session.username){

        let newPost = new PostModel();
        newPost.title = req.body.title;
        newPost.content = req.body.content;
        newPost.author = req.body.author;
        newPost.creationDate = new Date(Date.now());
        newPost.comments = [];
        newPost.save(function(err,result){
            if(err) return console.log(err);

            response = {
                message:'Post was saved successfully',
                type:'success',
            };
            res.send(response);

            // need to find correct post
            PostModel.find({_id:result._id},(err,docs)=>{
                if(err) return console.log(err);
                io.emit('updatePosts', docs[0]);
            })

        })

    }else{

        response = {
            type:'error',
            message:'Please login first'
        };

        res.send(response);

    }
});

app.post('/api/saveComment',(req,res)=>{
    let response = {};
    console.log('saveCommentRequest is being called');

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
                    response = {
                        message:'All went good!',
                        type:'success',
                    };
                    res.send(response);

                    PostModel.find({ _id: req.body.postId },(err,docs)=>{
                        if (err) {
                            console.log(err);
                        } else {
                            io.emit('updateComments', docs[0]);
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
        res.send(response);
    }

});

io.on('connection',(socket) => {

    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

});

http.listen(3000,() => {
    console.log('Socket.IO listening on Port 3000');
});

app.listen(9000, ()=>{
    console.log('Express app listening on Post 9000');
})
