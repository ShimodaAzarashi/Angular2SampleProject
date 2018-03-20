import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Category } from '../shared/entity/category';
import { Lang } from '../shared/entity/lang';
import { DocumentService } from "../shared/document.service";
import {DbService} from "../shared/db.service";
import { Utils } from "../shared/utils";

@Component({
  selector: 'category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})

export class CategoryDetail {

    public userId: string;
    public lang: string;
    public db: string;
    public category: string;
	public errorMessage: string = '';

    constructor(
        private router: Router,
        public utils: Utils,
        private dbService: DbService,
    	public dialogRef: MdDialogRef<CategoryDetail>
    ) {}

	validate() : boolean {
		if(!this.utils.inputCheckNoEmpty(this.category)) {
			this.errorMessage = "カテゴリ名は必須です。";
			return false;
		}
		if(!this.utils.inputCheckAlphaNumericWithHyphen(this.category)) {
			this.errorMessage = "カテゴリ名は半角英数小文字とハイフンのみ入力可能です。";
			return false;
		}
		if(this.category.length > 50) {
			this.errorMessage = "カテゴリ名は50文字以内で入力してください。";
			return false;
		}
		return true;
	}
	
    async addCategory() {
    	
		if(this.validate() == false) return;
    	await this.dbService.createCategory(this.userId, this.lang, this.db, this.category)
	      .then((result) => {
	      	  console.log(result);
	      	  //エラー判定
	      	  //if(result.message)

		      let link = ['/documents', this.userId + '_' + this.lang + '_' + this.db];
              this.router.navigate(link);
        });
        // create category を待ち合わせて、少し経ってからクローズする
        window.setTimeout(() => {
			this.dialogRef.close(this.category);
        }, 500);
    }

    cancel() {
    	this.dialogRef.close();
    }
}
