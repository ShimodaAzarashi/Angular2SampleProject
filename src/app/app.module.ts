import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from "./login/login-routing.module";

import { ToolbarComponent } from './toolbar/toolbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataUploadComponent } from './dataupload/dataupload.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { ChatboardComponent } from './chatboard/chatboard.component';

import { DocumentsComponent } from './documents/documents.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { ChatboxComponent } from './chatbox/chatbox.component';

import { ConfirmDialog }   from './dialog/confirm-dialog.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { SynonymService }     from "./shared/synonym.service";
import { DocumentService }    from "./shared/document.service";
import { DbService }          from "./shared/db.service";
import { AuthService }        from "./shared/auth.service";
import { AuthGuardService }   from "./shared/auth-guard.service";
import { Rmr2Env }            from "./shared/rmr2env";
import { DialogsService }     from './dialog/dialogs.service';
import { SpeechRecognitionService } from './shared/speech-recognition.service';
import { SpeechSynthesisService }   from './shared/speech-synthesis.service';

import { CategoryDetailService } from './category/category-detail.service';
import { CategoryDetail }        from './category/category-detail.component';

import { DatabaseDetailService } from './database/database-detail.service';
import { DatabaseDetail }        from './database/database-detail.component';
import { AccountComponent } from './account/account.component';
import { AccountDetailService } from './account/account-detail.service';
import { AccountDetail }        from './account/account-detail.component';

import { DictionaryDetailService } from './dictionary/dictionary-detail.service';
import { DictionaryDetail }        from './dictionary/dictionary-detail.component';

import { Utils }                   from './shared/utils';


@NgModule({
  declarations: [
    AppComponent,
    DocumentsComponent,
    DashboardComponent,
    DataUploadComponent,
    DictionaryComponent,
    ChatboardComponent,
    DocumentDetailComponent,
    DocumentListComponent,
    SidenavComponent,
    ChatboxComponent,
    ToolbarComponent,
    LoginComponent,
    ConfirmDialog,
    CategoryDetail,
    DatabaseDetail,
    DictionaryDetail,
    AccountComponent,
    AccountDetail
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule.forRoot(),
    LoginRoutingModule,
  ],
  providers: [
    SynonymService,
    DocumentService,
    DbService,
    AuthService,
    AuthGuardService,
    Rmr2Env,
    DialogsService,
    CategoryDetailService,
    DatabaseDetailService,
    DictionaryDetailService,
    SpeechRecognitionService,
    SpeechSynthesisService,
    AccountDetailService,
    Utils
  ],
  exports: [
    ConfirmDialog,
    CategoryDetail,
    DatabaseDetail,
    DictionaryDetail,
    AccountDetail,
  ],
  entryComponents: [
    ConfirmDialog,
    CategoryDetail,
    DatabaseDetail,
    DictionaryDetail,
    AccountDetail
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
