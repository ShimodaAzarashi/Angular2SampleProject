//import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'


import { ConfirmDialog } from './confirm-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public alert(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MdDialogRef<ConfirmDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(ConfirmDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.isConfirm = false;

        return dialogRef.afterClosed();
    }

    public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MdDialogRef<ConfirmDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(ConfirmDialog, config);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.isConfirm = true;

        return dialogRef.afterClosed();
    }
}