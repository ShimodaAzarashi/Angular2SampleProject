import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DbService } from "../shared/db.service";
import { DatabaseDetailService } from "../database/database-detail.service";
import { Company }      from '../shared/entity/company';
import { Document } from '../shared/entity/document';
import { DocumentService } from "../shared/document.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-chatboard',
  templateUrl: './chatboard.component.html',
  styleUrls: ['./chatboard.component.css'],
  providers: [DatabaseDetailService]
})
export class ChatboardComponent implements OnInit {

  chats: Array<Document> = new Array(0);

  @Input()
  chatUserDb: string;

  @Input()
  chatCategory: string;

  dbselected: boolean = false;

  categories: string[];

  currentCompany: Company = null;
  userId: string = '';
  userDb: string = '';
  lang: string;
  db: string;

  constructor(
    private dbService: DbService,
    private databaseDetailService: DatabaseDetailService,
    private documentService: DocumentService,
    private viewContainerRef: ViewContainerRef
  ) {}

  static KEY_STORAGE_CURRENT_DB: string = 'currentDb';
  
  ngOnInit() {
    this.userDb = sessionStorage.getItem(ChatboardComponent.KEY_STORAGE_CURRENT_DB);
    if (this.userDb) {
    	this.dbselected = true;
  		this.searchAllCategories();
  	} else {
  	    this.dbselected = false;
  	}
  }

  searchAllCategories(): void {
    this.userId = this.userDb.split('_')[0];
    this.lang = this.userDb.split('_')[1];
    this.db = this.userDb.split('_')[2];
	let dbname = this.userDb.slice(this.userDb.indexOf('_', this.userDb.indexOf('_'))+1);
    this.dbService.searchAllCategories(this.userId, this.lang, dbname)
      .then(categories => this.categories = categories);
  }

  onPushSendButton(userQuestion: string){
    this.search(userQuestion);
  }

  search(userQuestion: string): void {
    this.documentService.searchTopDocument(this.userId, this.lang, this.db, this.chatCategory, userQuestion, "10")
      .then(document => {
      console.log(document);
        this.chats.push(document)
      });
  }

}
