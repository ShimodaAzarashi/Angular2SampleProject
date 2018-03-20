/**
 * Created by saburoshiota on 2016/12/03.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentsComponent } from './documents/documents.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DataUploadComponent} from "./dataupload/dataupload.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {ChatboardComponent} from "./chatboard/chatboard.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuardService} from "./shared/auth-guard.service";
import {AccountComponent} from "./account/account.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  { path: 'dataupload',
    component: DataUploadComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  { path: 'dictionary',
    component: DictionaryComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  { path: 'chatboard',
    component: ChatboardComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  { path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  },
  { path: 'documents/:userDb',
    component: DocumentsComponent,
    canActivate: [AuthGuardService],
    canLoad: [AuthGuardService]
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
