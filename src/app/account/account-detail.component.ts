import { MdDialogRef } from '@angular/material';
import { OnInit, Component } from '@angular/core';
import { Http, Request, Response} from '@angular/http';
import { Lang } from '../shared/entity/lang';
import { AuthService } from "../shared/auth.service";
import { DbService } from "../shared/db.service";
import { Company } from '../shared/entity/company';
import { Utils } from "../shared/utils";

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})

export class AccountDetail {
	public message: string = '';
	public errorMessage: string = '';
	currentCompany: Company = null;
    account: Company = new Company;
    created: Company = new Company;
    isRepasswordMode: boolean = false;
    public userId: string;

    constructor(
        public utils: Utils,
        private dbService: DbService,
        public dialogRef: MdDialogRef<AccountDetail>
    ) {}

	ngOnInit() {
		this.currentCompany = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
	}

	validate() : boolean {
		if(!this.utils.inputCheckNoEmpty(this.account.prefix)) {
			this.errorMessage = "ユーザIDは必須です。";
			return false;
		}
		if(!this.utils.inputCheckNoEmpty(this.account.login_id)) {
			this.errorMessage = "ログインIDは必須です。";
			return false;
		}
		if(!this.utils.inputCheckNoEmpty(this.account.password)) {
			this.errorMessage = "パスワードは必須です。";
			return false;
		}
		if(!this.utils.inputCheckAlphaNumericWithHyphen(this.account.prefix)) {
			this.errorMessage = "ユーザIDは半角英数小文字とハイフンのみ入力可能です。";
			return false;
		}
		if(!this.utils.inputCheckEmail(this.account.login_id)) {
			this.errorMessage = "ログインIDはEmail形式で入力してください。";
			return false;
		}
		if(!this.utils.inputCheckAlphaNumericWithSymbol(this.account.password)) {
			this.errorMessage = "パスワードは半角英数字及び記号で入力してください。";
			return false;
		}
		if(this.account.prefix.length > 50) {
			this.errorMessage = "ユーザIDは50文字以内で入力してください。";
			return false;
		}
		return true;
	}

	repasswordValidate() : boolean {
		if(!this.utils.inputCheckNoEmpty(this.account.password)) {
			this.errorMessage = "パスワードは必須です。";
			return false;
		}
		if(!this.utils.inputCheckAlphaNumericWithSymbol(this.account.password)) {
			this.errorMessage = "パスワードは半角英数字及び記号で入力してください。";
			return false;
		}
		return true;
	}
	
	addAccount(): Promise<Company> {
  		if(this.validate() == false) return;
  		this.errorMessage = "";
  		this.message = "";
    	return this.dbService.createChildAccount(this.currentCompany.prefix, this.account)
    	.then(result => {
    		console.log(result);
    		if(!result){
    			this.errorMessage = "ユーザー登録エラーが発生しました。";
    		} else {
    			this.message = "正常に登録されました。";
    		}
    		this.created = result;
	    });
	}

	changePassword() {
	  if(this.repasswordValidate() == false) return;
      this.errorMessage = "";
      this.message = "";
      return this.dbService.rePasswordChildAccount(this.currentCompany.prefix, this.account)
      .then(result => {
        console.log(result);
        if(!result){
          this.errorMessage = "パスワード再発行エラーが発生しました。";
        }else {
          window.setTimeout(() => {
            this.dialogRef.close(true);
          }, 500);
        }
      });
	}
	close() {
		this.dialogRef.close(true);
	}
	cancel() {
		this.dialogRef.close();
	}
}
