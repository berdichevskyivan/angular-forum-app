import {Component, OnInit} from '@angular/core';
import {ForumService} from '../../services/forum.service';
import {PostCreationModalComponent} from '../../components/modals/post-creation-modal/post-creation-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AnimationOptions} from 'ngx-lottie';
import {SocketService} from '../../services/socket.service';
import {AuthResponse, Post} from '../../models/models';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent implements OnInit {

  public loaderAnimationOptions: AnimationOptions = {
    path: '/assets/loader.json'
  };

  public postAnimationOptions: AnimationOptions = {
    path: '/assets/post.json'
  };

  constructor(public forumService: ForumService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {

    this.forumService.getPosts();

  }

  logout(): void {

    this.forumService.isLoading = true;

    this.forumService.logout().subscribe((authResponse: AuthResponse) => {
      this.forumService.isLoading = false;
      if (authResponse.type === 'success'){
        this.router.navigateByUrl('/login');
      }
    });

  }

  goToCreatePost(): void {

    this.dialog.open(PostCreationModalComponent, {
      data: {title: '', author: this.forumService.userData.username, content: '', }
    });

  }

  goToPost(id: string): void {
   console.log(id);
   this.router.navigateByUrl(`/forum-post?id=${id}`);
   this.forumService.isLoading = true;
  }

}
