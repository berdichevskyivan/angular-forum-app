import { Component, OnInit } from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { NgForm } from '@angular/forms';

import { AuthData, AuthResponse, SessionValidationResponse } from '../../models/models';

import { ForumService } from '../../services/forum.service';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

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

  constructor(private forumService: ForumService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.forumService.validateSession().subscribe((data: SessionValidationResponse) => {
      if (data.type === 'success'){
        this.router.navigateByUrl('/forum');
      }
    });
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

      if (this.currentActivePage === 'login'){

        this.forumService.login(authData).subscribe((authResponse: AuthResponse) => {

          console.log(authResponse);

          this.snackbar.open(authResponse.message, '', { duration: 2000 });

          if (authResponse.type === 'success'){
            this.forumService.userData.username = authData.username;
            this.router.navigateByUrl('/forum');
          }

        });

      }else if (this.currentActivePage === 'register'){

        this.forumService.register(authData).subscribe((authResponse: AuthResponse) => {

          console.log(authResponse);

          this.snackbar.open(authResponse.message, '', { duration: 2000 });

          if (authResponse.type === 'success'){
            this.forumService.userData.username = authData.username;
            this.router.navigateByUrl('/forum');
          }

        });

      }

    }

  }

  animationCreated(animationItem: AnimationItem): void { }

}
