import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services/forum.service';
import {Post, PostComment, SavePostResponse, SavePostCommentResponse, SessionValidationResponse, AuthResponse} from '../../models/models';

import { PostCreationModalComponent } from '../../components/post-creation-modal/post-creation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AnimationOptions} from 'ngx-lottie';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent implements OnInit {

  public loaderAnimationOptions: AnimationOptions = {
    path: '/assets/loader.json'
  };

  constructor(public forumService: ForumService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    this.forumService.validateSession().subscribe((data: SessionValidationResponse) => {
      if (data.type === 'success'){
        this.forumService.getPosts();
        console.log(this.forumService.userData.username);
      } else {
        // We log you out
        this.forumService.logout();
        this.router.navigateByUrl('/login');
      }
    });

  }

  handleClickLogoutButton(): void {
    this.forumService.isLoading = true;
    this.forumService.logout().subscribe((data: AuthResponse) => {
      this.forumService.isLoading = false;
      console.log(data);
      if (data.type === 'success'){
        this.router.navigateByUrl('/login');
      }
    });

  }

  handleClickCreatePostButton(): void {

    const dialogRef = this.dialog.open(PostCreationModalComponent, {
      data: {title: '', author: this.forumService.userData.username, content: '', }
    });

  }

  handleClickPostComment(post: Post): void {

    const newComment: PostComment = {
      author: this.forumService.userData.username,
      content: post.currentComment,
      postId: post._id,
    };

    console.log(newComment);

    this.forumService.saveComment(newComment).subscribe((data: SavePostCommentResponse) => {

      this.forumService.getPosts();

    });

  }

}
