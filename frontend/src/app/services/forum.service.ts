import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import {AuthData, AuthResponse, Post, PostComment, UserData} from '../models/models';

// rxJS imports
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    public userData: UserData = { username: '' };

    public posts: Post[] = [];
    public isLoading = true;

    constructor(private http: HttpClient){  }

    post( path: string, data: any ): Observable<any>  {
        return this.http.post(environment.serverUrl + path , data, { withCredentials: true });
    }
    get( path: string ): Observable<any> {
        return this.http.get( environment.serverUrl + path , { withCredentials: true } );
    }

    login( authData: AuthData ): Observable<AuthResponse> {
        console.log(authData);
        return this.post('/api/login', authData);
    }

    logout(): Observable<any> {
        return this.get('/api/logout');
    }

    validateSession(): Observable<any> {
        return this.get('/api/validateSession');
    }

    register( authData: AuthData ): Observable<AuthResponse> {
        return this.post('/api/register', authData);
    }

    savePost( post: Post ): Observable<any> {
        return this.post('/api/savePost', post);
    }

    getPosts(): void {
        this.get('/api/posts').subscribe((data: Post[]) => {
            console.log(data);
            // Request has arrived
            this.isLoading = false;
            this.posts = [...data];
        });
    }

    getPost(id: string): Observable<Post>  {
        return this.post('/api/post', { postId: id });
    }

    saveComment( postComment: PostComment ): Observable<any> {
        return this.post('/api/saveComment', postComment);
    }

}
