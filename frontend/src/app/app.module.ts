// Import all Froala Editor plugins.
import 'froala-editor/js/plugins.pkgd.min.js';

// Import a single Froala Editor plugin.
// import 'froala-editor/js/plugins/align.min.js';

// Import a Froala Editor language file.
// import 'froala-editor/js/languages/de.js';

// Import a third-party plugin.
// import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/image_tui.min';
// import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/embedly.min';

import { BrowserModule } from '@angular/platform-browser';
import {NgModule, ɵPlayerFactory} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Froala
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

// Angular HTTP Client
import { HttpClientModule } from '@angular/common/http';
import { ForumService } from 'src/app/services/forum.service';

// Forms Module needed for ngModel directive
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { ForumComponent } from './pages/forum/forum.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// Lottie modules
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { PostCreationModalComponent } from './components/post-creation-modal/post-creation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // angular material imports
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    // froala module
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    // http client module
    HttpClientModule,
    // FormsModule for ngModel directive
    FormsModule,
    CommonModule,
    LottieModule.forRoot({ player: playerFactory }),
    MatDialogModule],
  providers: [ForumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
