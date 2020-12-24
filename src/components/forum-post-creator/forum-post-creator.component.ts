import { Component } from '@angular/core';
import { HttpService } from 'src/services/HttpService.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ForumLogin } from 'src/components/forum-login/forum-login.component';

@Component({
    selector:'forum-post-creator',
    templateUrl:'./forum-post-creator.component.html',
    styleUrls:['./forum-post-creator.component.scss'],
    providers: [ForumLogin],
})

export class ForumPostCreator { 

    public editorContent: string = '';

    constructor(private httpService: HttpService, private _snackBar: MatSnackBar, public forumLoginComponent:ForumLogin){  }

    savePost(){
        console.log('saving post...');
        if(this.editorContent === ''){
            let snackBarRef = this._snackBar.open('You must enter some values for your post','',{
                duration:2000,
            });
            return;
        }

        this.httpService.savePost({postContent:this.editorContent}).subscribe((data:any)=>{
            console.log(data);
            let snackBarRef = this._snackBar.open(data.message,'',{
                duration:2000,
            });
            if(data.type==='success'){
                this.editorContent = '';
            }
        })
    }

};