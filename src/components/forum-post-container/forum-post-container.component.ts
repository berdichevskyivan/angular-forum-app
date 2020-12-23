import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/services/HttpService.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector:'forum-post-container',
    templateUrl:'./forum-post-container.component.html',
    styleUrls:['./forum-post-container.component.scss']
})

export class ForumPostContainer{

    public posts: any = [];

    constructor(private httpService:HttpService, private _snackBar:MatSnackBar){ 
        this.posts = this.posts.map((p:any)=>{
            p.postCommentValue = '';
            return p;
        })
     }

    getPosts(){
        console.log('calling getPosts()');
        this.httpService.getPosts().subscribe((data:any)=>{
            console.log(data);
            this.posts = data;
            this.posts = this.posts.map((p:any)=>{
                p.postComments = p.postComments.reverse();
                return p;
            })
        })
    }

    ngOnInit(){
        this.getPosts();
    }

    postComment(id:any, commentValue:any){

        console.log(this.posts);

        let username = localStorage.getItem('username');
        if(!username){
            let snackBarRef = this._snackBar.open('You must login first','',{
                duration:2000,
            });
            return ;
        }

        if(!commentValue){
            let snackBarRef = this._snackBar.open('You must enter some words in the comment section to post','',{
                duration:2000,
            });
            return ;
        }

        console.log('calling postComment()');
        this.httpService.saveComment({postId:id,postComment:{
            postCommentAuthor:`${username}`,
            postCommentContent:`${commentValue}`
        }}).subscribe((data:any)=>{
            console.log(data);
            this.getPosts();
        })
    }

};