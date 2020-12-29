import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post, SavePostResponse } from '../../models/models';

import { ForumService } from '../../services/forum.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-creation-modal',
  templateUrl: './post-creation-modal.component.html',
  styleUrls: ['./post-creation-modal.component.scss']
})
export class PostCreationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PostCreationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public post: Post,
              private forumService: ForumService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleClickOnCreatePostButton(): void {
    console.log('create post button was clicked');
    console.log(this.post);
    this.forumService.savePost(this.post).subscribe((savePostResponse: SavePostResponse) => {
      this.snackbar.open(savePostResponse.message, '', { duration: 2000 });
      if (savePostResponse.type === 'success'){
        this.dialogRef.close();
        this.forumService.getPosts();
      }
    });
  }

}
