import { Injectable } from '@angular/core';
import {ForumService} from './forum.service';
import {SessionValidationResponse} from '../models/models';
import {SocketService} from './socket.service';

import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

    constructor(private forumService: ForumService, private socketService: SocketService){  }

    public isAuthenticated(): void {
        this.socketService.validateSession(true);
    }

}
