import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/HttpService.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector:'forum-login',
    templateUrl:'./forum-login.component.html',
    styleUrls:['./forum-login.component.scss'],
    providers:[HttpService],
})

export class ForumLogin{

    public username: string;
    password: string;
    isUserLoggedIn: boolean;

    constructor(private httpService: HttpService, private _snackBar: MatSnackBar){ 
        this.username = '';
        this.password = '';
        this.isUserLoggedIn = false;
    }

    openSnackBar(message:string, action:string){
        this._snackBar.open(message,action,{duration:2000});
    }

    ngOnInit(){
        if(localStorage.getItem('username')){
            // this means user is logged in
            this.username = `${localStorage.getItem('username')}`;
            this.isUserLoggedIn = true;
        }
    }

    login(){
        this.httpService.login({username:this.username,password:this.password}).subscribe((data:any)=>{
            console.log(data);
            if(data.type==='success'){
                // means it was logged in
                this.isUserLoggedIn = true;
                // we will also store this state in the localStorage
                localStorage.setItem('username',`${this.username}`);
            }else{
                // means it was not found
                let snackBarRef = this._snackBar.open(data.message,'',{
                    duration:2000,
                });
            }
        })
    }

    register(){
        if(this.username === '' || this.password === ''){
            alert('Please fill both fields');
            return;
        }
        this.httpService.register({username:this.username,password:this.password}).subscribe((data:any)=>{
            console.log(data);
            if(data.type==='success'){
                // means it was registered and can be logged in
                this.isUserLoggedIn = true;
                // we will also store this state in the localStorage
                localStorage.setItem('username',`${this.username}`);
                let snackBarRef = this._snackBar.open(data.message,'',{
                    duration:2000,
                });
            }else{
                // means it was not found
                let snackBarRef = this._snackBar.open(data.message,'',{
                    duration:2000,
                });
            }
        })
    }

    logout(){
        this.isUserLoggedIn = false;
        localStorage.clear();
    }

};