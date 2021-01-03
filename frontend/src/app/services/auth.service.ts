import { Injectable } from '@angular/core';
import {ForumService} from './forum.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

    constructor(private forumService: ForumService, private router: Router){  }

    public async isAuthenticated(): Promise<boolean> {
        const result = await this.forumService.validateSession().toPromise();
        if (result.type === 'success') {
            this.forumService.userData.username = result.username;
            return true;
        } else {
            this.router.navigateByUrl('login');
            return false;
        }
    }


}
