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
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Project's components
import { ForumPostContainer } from '../components/forum-post-container/forum-post-container.component';
import { ForumPostCreator } from '../components/forum-post-creator/forum-post-creator.component';
import { ForumLogin } from '../components/forum-login/forum-login.component';

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
import { HttpService } from 'src/services/HttpService.service';

// Forms Module needed for ngModel directive
import { FormsModule } from '@angular/forms';

// Need data from the ForumLogin component

@NgModule({
  declarations: [
    AppComponent,
    ForumPostContainer,
    ForumPostCreator,
    ForumLogin,
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
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
