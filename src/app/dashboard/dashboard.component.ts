import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DbService } from "../shared/db.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {DialogsService} from "../dialog/dialogs.service";
import { DocumentService } from "../shared/document.service";
import {DatabaseDetailService} from "../database/database-detail.service";
import { Company }      from '../shared/entity/company';
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatabaseDetailService, DialogsService]
})
export class DashboardComponent implements OnInit {

  currentCompany: Company = null;
  userId: string = '';
  userDbs: string[];

  constructor(
    private dbService: DbService,
    private router: Router,
    private databaseDetailService: DatabaseDetailService,
    private dialogsService: DialogsService,
    private viewContainerRef: ViewContainerRef
  ) {}


  ngOnInit() {
    this.currentCompany = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
    if( this.currentCompany ){
//      console.debug('this.currentCompany.prefix=' + this.currentCompany.prefix);
    }
  	this.userId = this.currentCompany.prefix;
    this.searchAllDbs();
  }

  searchAllDbs(): void {
    this.dbService.searchAllDb(this.userId)
      .then(userDbs => {
//      alert("OK!");

      	this.userDbs = [];
		for(var dbname in userDbs) {
			let userDb = userDbs[dbname];
			this.userDbs.push(userDb.slice(userDb.indexOf('_')+1));
		}
      });
  }

  static KEY_STORAGE_CURRENT_DB: string = 'currentDb';
  onSelectDB(userDb: string): void{
    let currentDb =  this.userId + "_" + userDb;
    sessionStorage.setItem(DashboardComponent.KEY_STORAGE_CURRENT_DB, currentDb);
    let link = ['/documents', currentDb];
    this.router.navigate(link);
  }

  async addDatabase(): Promise<string> {
  	await this.databaseDetailService
      .add(this.userId, this.viewContainerRef)
      .subscribe(
	      result => {
//	      	  console.log(result);
	          if (result) {
	              this.searchAllDbs();
              }
	          this.viewContainerRef = null;
          }
      );
    return <any>Promise.resolve("Success");
  }

  async deleteDataBase(userDb: string): Promise<string> {
    this.dialogsService
      .confirm('確認', 'データベースを削除しますか？', this.viewContainerRef)
      .subscribe(
	      result => {
	          if (result) {
	          	  let lang = userDb.split('_')[0];
		          let dbname = userDb.slice(userDb.indexOf('_', userDb.indexOf('_'))+1);
                  this.dbService.deleteDatabase(this.userId, lang, dbname)
                  .then(result => {
//	                  console.log(result);
	                  if (result) {
			              this.searchAllDbs();
        		      }
	          		  this.viewContainerRef = null;
                  });
              } else {
//                  console.log("キャンセルです。");
              }
	          this.viewContainerRef = null;
          }
      );
      return <any>Promise.resolve("Success");
  }



}
