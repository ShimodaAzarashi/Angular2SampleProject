import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';
import { Http, Request, Response} from '@angular/http';
import { Database } from '../shared/entity/database';
import { Lang } from '../shared/entity/lang';
import { DbService } from "../shared/db.service";
import { Utils } from "../shared/utils";

@Component({
  selector: 'database-detail',
  templateUrl: './database-detail.component.html',
  styleUrls: ['./database-detail.component.css']
})

export class DatabaseDetail {
	public isError: boolean = false;
	public errorMessage: string = '';
	public langs: Lang[] = new Array(0);

    public userId: string;

    public database: Database = {
       name: '',
       lang: ''
    };

    constructor(
    	public utils: Utils,
        private dbService: DbService,
    	public dialogRef: MdDialogRef<DatabaseDetail>
    ) {
    	this.langs.push(new Lang("日本語", "ja"));
    	this.langs.push(new Lang("英語", "en"));
    	this.database.lang = this.langs[0].value;
	}

	validate() : boolean {
		if(!this.utils.inputCheckNoEmpty(this.database.name)) {
			this.errorMessage = "DB名は必須です。";
			return false;
		}
		if(!this.utils.inputCheckAlphaNumericWithHyphen(this.database.name)) {
			this.errorMessage = "DB名は半角英数小文字とハイフンのみ入力可能です。";
			return false;
		}
		if(this.database.name.length > 50) {
			this.errorMessage = "DB名は50文字以内で入力してください。";
			return false;
		}
		return true;
	}

    async addDatabase() {
    	if(this.validate() == false) return;

	    var createResult: boolean = false;
    	await this.dbService.createDatabase(this.userId, this.database.lang, this.database.name)
	      .then(res => {
/*
              Promise.resolve(res).then(JSON.parse).then(
                 jsonData => {
       		      console.log(jsonData);
                 }
              );
*/
			// TODO エラー内容のチェック（元々は必ずエラーメッセージが出るようになっていました）
			if(!res){
			  console.log(res);
			  this.isError = true;
			  this.errorMessage = 'DB名重複エラー';
			}

	    	// create databaseを待ち合わせて、少し経ってからクローズする
	        window.setTimeout(() => {
	          // close after creation by await
	    	  this.dialogRef.close(true);
	        }, 500);

        });
    }

    cancel() {
    	this.dialogRef.close();
    }
}
