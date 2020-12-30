import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post, SavePostResponse } from '../../../models/models';
import { ForumService } from '../../../services/forum.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForm} from '@angular/forms';
import {SocketService} from '../../../services/socket.service';

@Component({
  selector: 'app-post-creation-modal',
  templateUrl: './post-creation-modal.component.html',
  styleUrls: ['./post-creation-modal.component.scss']
})
export class PostCreationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PostCreationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public post: Post,
              private forumService: ForumService,
              private socketService: SocketService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  handleCreatePost(f: NgForm): void {

    if (f.invalid) {

      this.snackbar.open('You must enter a title and some content', '', { duration: 2000 });

    } else {

      this.socketService.savePost(this.post, this.dialogRef);

    }

  }

}
