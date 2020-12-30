import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { NgForm } from '@angular/forms';
import { AuthData, AuthResponse, SessionValidationResponse } from '../../models/models';
import { ForumService } from '../../services/forum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {SocketService} from '../../services/socket.service';

import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public currentActivePage = 'login';

  public loginAnimationOptions: AnimationOptions = {
      path: '/assets/water.json'
  };

  public registerAnimationOptions: AnimationOptions = {
      path: '/assets/fire.json'
  };

  constructor(private forumService: ForumService, private socketService: SocketService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.socketService.validateSession(false);
  }

  handleClickLoginButton(): void {
    this.currentActivePage = 'login';
  }

  handleClickRegisterButton(): void {
    this.currentActivePage = 'register';
  }

  handleSubmitAuthForm(f: NgForm): void {

    if (f.invalid){

      this.snackbar.open('Data is invalid', '', { duration: 2000 });

    } else {

      const authData: AuthData = f.value;
      console.log(authData);

      if (this.currentActivePage === 'login') {

        this.socketService.login(authData);

      } else if (this.currentActivePage === 'register'){

        this.socketService.register(authData);

      }

    }

  }

  animationCreated(animationItem: AnimationItem): void { }

}
