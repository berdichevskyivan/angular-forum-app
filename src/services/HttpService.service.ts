import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxJS imports
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const BASE_URL = "http://localhost:9000"

type LoginData = {
    username:String;
    password:String;
}

@Injectable({
    providedIn:'root'
})
export class HttpService {
    constructor(private http: HttpClient){  }

    login(loginData: LoginData){
        return this.http.post(BASE_URL+'/api/login',loginData);
    }

    // add function to register users
    register(data:any){
        return this.http.post(BASE_URL+'/api/register',data);
    }

    // add function to save posts
    savePost(data:any){
        return this.http.post(BASE_URL+'/api/savePost',data);
    }

    // add function to retrieve posts
    getPosts(){
        // should get the comments here
        return this.http.get(BASE_URL+'/api/posts')
    }

    // add function to add comments to posts
    saveComment(data:any){
        return this.http.post(BASE_URL+'/api/saveComment',data)
    }

    // add function to load comments on posts
}