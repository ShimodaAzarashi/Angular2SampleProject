import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'confirm-dialog',
    template: `
        <p>{{ title }}</p>
        <p [innerHTML]="message"></p>
        <button type="button" md-raised-button 
            (click)="dialogRef.close(true)">OK</button>
        <button *ngIf="isConfirm" type="button" md-button 
            (click)="dialogRef.close()">キャンセル</button>
    `,
})

export class ConfirmDialog {

    public title: string;
    public message: string;
    public isConfirm: boolean;

    constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

    }
}
