import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  public pageNotFoundAnimationOptions: AnimationOptions = {
    path: '/assets/pageNotFound.json'
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 7000);
  }

}
