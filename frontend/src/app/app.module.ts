import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/third_party/embedly.min';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { HttpClientModule } from '@angular/common/http';
import { ForumService } from 'src/app/services/forum.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { ForumComponent } from './pages/forum/forum.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { PostCreationModalComponent } from './components/modals/post-creation-modal/post-creation-modal.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ForumPostComponent } from './pages/forum-post/forum-post.component';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {SocketService} from './services/socket.service';
import {ScrollingModule} from '@angular/cdk/scrolling';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { transports: ['websocket'] }};

export function playerFactory(): any{
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForumComponent,
    PageNotFoundComponent,
    PostCreationModalComponent,
    ForumPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    HttpClientModule,
    FormsModule,
    CommonModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatDialogModule,
    ScrollingModule,
    SocketIoModule.forRoot(config)],
  providers: [ForumService, SocketService, AuthService, AuthGuardService, { provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
