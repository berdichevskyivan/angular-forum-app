import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {Post} from '../models/models';
import {ForumService} from './forum.service';

const ioFunc = (io as any).default ? (io as any).default : io;

@Injectable()
export class SocketService {

    public socket: Socket = ioFunc(environment.socketServerUrl);

    constructor(public forumService: ForumService){
        this.socket.on('updatePosts', (post: Post) => {
            console.log('getting a response -> updatePosts');
            console.log(post);

            const newPosts = [...this.forumService.posts];
            newPosts.push(post);
            this.forumService.posts = newPosts;

        });

        this.socket.on('updateComments', (post: Post) => {
            console.log('getting a response -> updateComments');
            // handled in /forum page
            const newPosts = [...this.forumService.posts];
            newPosts.map((newPost: Post) => {
                if (newPost._id === post._id){
                    newPost.comments = post.comments;
                }
                return newPost;
            });
            this.forumService.posts = newPosts;
        });
    }

}
