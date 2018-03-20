//import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'


import { DatabaseDetail } from './database-detail.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class DatabaseDetailService {

    constructor(private dialog: MdDialog) { }

    public add(userId: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<DatabaseDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(DatabaseDetail, config);
		dialogRef.componentInstance.userId = userId;
	  	
        return dialogRef.afterClosed();
    }
}