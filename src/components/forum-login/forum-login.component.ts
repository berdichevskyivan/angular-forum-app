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

    public username: string = '';
    password: string = '';
    isUserLoggedIn: boolean = false;

    constructor(private httpService: HttpService, private _snackBar: MatSnackBar){  }

    openSnackBar(message:string, action:string){
        this._snackBar.open(message,action,{duration:2000});
    }

    ngOnInit(){
        // now we validate by asking the server . . . 
        console.log('ngOnInit() -> Validating session...');
        this.httpService.validateSession().subscribe((data:any)=>{
            console.log(data);
            if(data.type==='success'){
                // means user is logged in
                // retrieve username from response
                this.username = data.username;
                this.isUserLoggedIn = true;
            }else{
                // means user is NOT logged in
                // Cleaning variables
                this.username = '';
                this.password = '';
                this.isUserLoggedIn = false;
            }
        });

        // if(localStorage.getItem('username')){
        //     // this means user is logged in
        //     this.username = `${localStorage.getItem('username')}`;
        //     this.isUserLoggedIn = true;
        // }
    }

    login(){
        this.httpService.login({username:this.username,password:this.password}).subscribe((data:any)=>{
            console.log(data);
            if(data.type==='success'){
                // means it was logged in
                this.isUserLoggedIn = true;
                // now we're storing state in session object instead of localStorage
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
                // we retrieve username from response
                this.username = data.username;
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
        this.httpService.logout().subscribe((data:any)=>{
            console.log('Logged out in server...');
        });
    }

};