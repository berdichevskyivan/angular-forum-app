import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import {Post, PostComment, SavePostCommentResponse, SavePostResponse} from '../../models/models';
import { AnimationOptions } from 'ngx-lottie';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  public loaderAnimationOptions: AnimationOptions = {
    path: '/assets/loader.json'
  };

  public post: Post = { _id: '', title: '', content: '', author: '', currentComment: '', creationDate: new Date(), comments: [] };

  public postId = '';

  constructor(public forumService: ForumService,
              private socketService: SocketService,
              private router: Router,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {

    this.socketService.socket.on('updateComments', (post: Post) => {
      console.log('getting a response -> updateComments');
      this.post = post;
    });

    this.forumService.isLoading = true;

    this.route.queryParams.subscribe(params => {
      if (!params.id) {
        this.forumService.isLoading = false;
        this.router.navigateByUrl('forum');
      } else {
        this.postId = params.id;

        this.forumService.getPost(this.postId).subscribe((postResponse: Post) => {
            this.post = postResponse;
            this.postId = postResponse._id;
            this.forumService.isLoading = false;
        });
      }
    });
  }

  handleClickGoBackButton(): void {
    this.router.navigateByUrl('/forum');
    this.forumService.isLoading = true;
  }

  handleClickPostComment(post: Post): void {

    if (!post.currentComment) {

      this.snackbar.open('You can\'t send an empty comment', '', { duration: 2000 });

    } else {

      const newComment: PostComment = {
        author: this.forumService.userData.username,
        content: post.currentComment,
        postId: post._id,
      };

      console.log(newComment);

      this.forumService.saveComment(newComment).subscribe((response: SavePostCommentResponse) => {
        this.snackbar.open(response.message, '', { duration: 2000 });
      });

    }

  }

}
