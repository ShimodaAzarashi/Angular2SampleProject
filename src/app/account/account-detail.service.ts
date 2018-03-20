import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import { AccountDetail } from './account-detail.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';
import { Company } from '../shared/entity/company';

@Injectable()
export class AccountDetailService {

    constructor(private dialog: MdDialog) { }

    public addAccount(viewContainerRef: ViewContainerRef): Observable<boolean> {
        let dialogRef: MdDialogRef<AccountDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(AccountDetail, config);
        return dialogRef.afterClosed();
    }
    
    public rePassword(company: Company, viewContainerRef: ViewContainerRef): Observable<boolean> {
	    company.password = "";
        let dialogRef: MdDialogRef<AccountDetail>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;
        dialogRef = this.dialog.open(AccountDetail, config);
        dialogRef.componentInstance.account = company;
        dialogRef.componentInstance.isRepasswordMode = true;        
        return dialogRef.afterClosed();
    }
}