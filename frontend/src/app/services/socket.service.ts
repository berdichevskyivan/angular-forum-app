import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import * as io from 'socket.io-client';
import {
    AuthData,
    AuthResponse,
    Post,
    PostComment,
    SavePostCommentResponse,
    SavePostResponse,
    SessionValidationResponse
} from '../models/models';
import {ForumService} from './forum.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import {PostCreationModalComponent} from '../components/modals/post-creation-modal/post-creation-modal.component';

const ioFunc = (io as any).default ? (io as any).default : io;

@Injectable()
export class SocketService {

    public socket: Socket = ioFunc('http://localhost:3000');

    public isAuthGuard = false;

    constructor(private forumService: ForumService,
                private router: Router,
                private snackbar: MatSnackBar,
                public dialogRef: MatDialogRef<any>){

        this.socket.on('validateSessionResponse', (data: SessionValidationResponse) => {
            console.log(data);
            if (data.type === 'success'){
                if (!this.isAuthGuard) {
                    this.forumService.userData.username = data.username;
                    this.router.navigateByUrl('/forum');
                }
            } else {
                this.forumService.isLoading = false;
                this.router.navigateByUrl('/login');
            }
        });

        this.socket.on('loginResponse', (authResponse: AuthResponse) => {
            console.log(authResponse);
            this.snackbar.open(authResponse.message, '', { duration: 2000 });
            this.forumService.isLoading = false;
            if (authResponse.type === 'success'){
                this.forumService.userData.username = authResponse.username;
                this.router.navigateByUrl('/forum');
            }
        });

        this.socket.on('logoutResponse', (authResponse: AuthResponse) => {
            this.forumService.isLoading = false;
            if (authResponse.type === 'success'){
                this.router.navigateByUrl('/login');
            }
        });

        this.socket.on('registerResponse', (authResponse: AuthResponse) => {
            console.log(authResponse);
            this.snackbar.open(authResponse.message, '', { duration: 2000 });
            this.forumService.isLoading = false;
            if (authResponse.type === 'success'){
                this.forumService.userData.username = authResponse.username;
                this.router.navigateByUrl('/forum');
            }
        });

        this.socket.on('postsResponse', (postsResponse: Post[]) => {
            console.log(postsResponse);
            this.forumService.isLoading = false;
            this.forumService.posts = [...postsResponse];
        });

        this.socket.on('savePostResponse', (savePostResponse: SavePostResponse) => {
            this.snackbar.open(savePostResponse.message, '', { duration: 2000 });
            if (savePostResponse.type === 'success') {
                this.dialogRef.close();
            }
        });

        this.socket.on('saveCommentResponse', (saveCommentResponse: SavePostCommentResponse) => {
           console.log(saveCommentResponse);
        });

    }

    validateSession(isAuthGuard: boolean): void {
        this.isAuthGuard = isAuthGuard;
        this.socket.emit('validateSessionRequest');
    }

    login(authData: AuthData): void {
        this.forumService.isLoading = true;
        this.socket.emit('loginRequest', authData);
    }

    logout(): void {
        this.socket.emit('logoutRequest');
    }

    register(authData: AuthData): void {
        this.forumService.isLoading = true;
        this.socket.emit('registerRequest', authData);
    }

    getPosts(): void {
        this.socket.emit('postsRequest');
    }

    getPost(postId: string): void {
        this.socket.emit('postRequest', postId);
    }

    savePost(post: Post, dialog: MatDialogRef<PostCreationModalComponent>): void {
        this.dialogRef = dialog;
        this.socket.emit('savePostRequest', post);
    }

    saveComment(comment: PostComment): void {
        this.socket.emit('saveCommentRequest', comment);
    }

}
