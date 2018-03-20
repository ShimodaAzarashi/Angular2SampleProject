import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DbService } from "../shared/db.service";
import { AuthService } from "../shared/auth.service";
import { DialogsService } from "../dialog/dialogs.service";
import { AccountDetailService } from "./account-detail.service";
import { Company } from '../shared/entity/company';
import { Utils } from "../shared/utils";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [DialogsService, AccountDetailService]
})
export class AccountComponent implements OnInit {

  constructor(
    public utils: Utils,
    private dbService: DbService,
    private dialogsService: DialogsService,
    private accountDetailService: AccountDetailService,
    private viewContainerRef: ViewContainerRef
  ) { }

  public errorMessage: string = '';
  currentCompany: Company = null;
  userId: string;
  companies: Company[] = new Array(0);
  account: Company = new Company;
  created: Company = new Company;
  isAddable: boolean = false;
  isSearchNow: boolean = false;

  ngOnInit() {
    this.currentCompany = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
    this.userId = this.currentCompany.prefix;
    this.listCompanies();
  }

  async listCompanies() {
    let myCompany: Company = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
    this.isSearchNow = true;
    await this.dbService.listAccount(myCompany.prefix)
      .then(companies => {
      	this.companies = companies;
      	// 新規登録権限設定
      	for(var i = 0; i < this.companies.length; i++) {
   			let isOwner: boolean = this.companies[i].login_id === this.currentCompany.login_id;
   			let isOwnership: boolean = this.companies[i].ownership === "PARENT";
   			// 管理者権限
   		    if(isOwnership && isOwner) {
		   		this.isAddable = true;
		   	}
      	}
      	for(var i = 0; i < this.companies.length; i++) {
   			let isOwner: boolean = this.companies[i].login_id === this.currentCompany.login_id;
   			let isOwnership: boolean = this.companies[i].ownership === "PARENT";
   			if(this.isAddable && !isOwner) {
   				this.companies[i].isRepassword = true;
   				this.companies[i].isDeletable = true;
				this.companies[i].isReCredential = true;
   			}
		}
      });
    this.isSearchNow = false;
  }

  addAccount(): Promise<string> {
  	this.accountDetailService
      .addAccount(this.viewContainerRef)
      .subscribe(
	      result => {
	      	  console.log(result);
	          if (result) {
              	this.listCompanies();
		      }
	          this.viewContainerRef = null;
          }
      );
    return <any>Promise.resolve("Success");
  }

  rePassword(company): Promise<string> {
  	this.accountDetailService
      .rePassword(company, this.viewContainerRef)
      .subscribe(
	      result => {
	      	  console.log(result);
	          if ( true == result) {
	          	this.dialogsService.alert('確認', 'パスワードが正常に変更されました。' , this.viewContainerRef)
	          	.subscribe(result => {this.listCompanies();this.viewContainerRef = null;});
              }
          }
      );
    return <any>Promise.resolve("Success");
  }

  reissueCredential(company): Promise<string> {
	this.dialogsService
      .confirm('確認', '認証情報を再発行します。よろしいですか？', this.viewContainerRef)
      .subscribe(
	      result => {
	      if(result) {
		    this.dbService.reissueCredential(this.userId, company)
				.then(result => {
					console.log(result);
				    if (result.authentication_id) {
						this.dialogsService
					      .alert('確認', '認証情報を再発行しました。<br/>AuthenticationId: '
					      + result.authentication_id + '<br/>SecretKey: ' + result.secret_key
					      , this.viewContainerRef)
					      .subscribe(
						      result => {
								this.listCompanies();
						        this.viewContainerRef = null;
					          }
					      );
		            } else {
		            	this.dialogsService.alert('エラー', '再発行処理が失敗しました。' , this.viewContainerRef);
		            }
			    });
		    }
          }
      );
    return <any>Promise.resolve("Success");
  }

  deleteAccount(childUserId: string): Promise<string> {
	this.dialogsService
      .confirm('確認', 'アカウントを削除します。よろしいですか？', this.viewContainerRef)
      .subscribe(
	      result => {
	      if(result) {
			    this.dbService.deleteChildAccount(this.currentCompany.prefix, childUserId)
				  .then(result => {
					console.log(result);
				    if ( true == result) {
			          	this.listCompanies();
		            } else {
			            this.dialogsService.alert('エラー', '削除処理が失敗しました。' , this.viewContainerRef);
		            }
			    });
		    }
          }
      );
    return <any>Promise.resolve("Success");
  }
}
