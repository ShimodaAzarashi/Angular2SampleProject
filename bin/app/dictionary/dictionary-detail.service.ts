import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import { DictionaryDetail } from './dictionary-detail.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class DictionaryDetailService {

    constructor(private dialog: MdDialog) { }

    public addDictionary(userId: string, lang: string, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MdDialogRef<DictionaryDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(DictionaryDetail, config);
		dialogRef.componentInstance.userId = userId;
		dialogRef.componentInstance.lang = lang;
        return dialogRef.afterClosed();
    }
    
    public addSynonym(userId: string, lang: string, synset: string, viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MdDialogRef<DictionaryDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(DictionaryDetail, config);
		dialogRef.componentInstance.userId = userId;
		dialogRef.componentInstance.lang = lang;
		dialogRef.componentInstance.synset = synset;
        return dialogRef.afterClosed();
    }
}