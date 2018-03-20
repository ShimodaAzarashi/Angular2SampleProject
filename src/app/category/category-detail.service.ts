//import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'


import { CategoryDetail } from './category-detail.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class CategoryDetailService {

    constructor(private dialog: MdDialog) { }

    public add(userId: string, lang: string, db: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<CategoryDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(CategoryDetail, config);
		dialogRef.componentInstance.userId = userId;
		dialogRef.componentInstance.lang = lang;
        dialogRef.componentInstance.db = db;
        
        return dialogRef.afterClosed();
    }
}