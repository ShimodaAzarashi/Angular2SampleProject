import {Component, OnInit, Input, EventEmitter, Output, ViewContainerRef} from '@angular/core';
import {MdIconRegistry} from "@angular/material";
import { Document } from '../shared/entity/document';
import { DocumentService } from "../shared/document.service";
import {DbService} from "../shared/db.service";
import {DialogsService} from "../dialog/dialogs.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CategoryDetailService} from "../category/category-detail.service";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DialogsService, CategoryDetailService]
})
export class DocumentListComponent implements OnInit {

  public result: any;

  documents: Document[] = new Array(0);

  @Input()
  searchUserDb: string;
  @Input()
  category: string;
//  @Input()
  pagesize: string = '10';

  searchStr: string = '';

  userId: string;
  lang: string;
  db: string;
  categories: string[];

  isSearchNow: boolean = false;

  @Output()
  categoryChange = new EventEmitter<string>();

  @Output()
  documentEdit = new EventEmitter<Document>();


  constructor(
    private documentService: DocumentService,
    private dbService: DbService,
    private dialogsService: DialogsService,
    private categoryDetailService: CategoryDetailService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.searchAllCategories();
  }

  searchAllCategories(): void {
    this.userId = this.searchUserDb.split('_')[0];
    this.lang = this.searchUserDb.split('_')[1];
    this.db = this.searchUserDb.split('_')[2];

    this.dbService.searchAllCategories(this.userId, this.lang, this.db)
      .then(categories => this.categories = categories);
  }

  async search(term: string, pagesize: string): Promise<string> {
    var timerName: string = 'search time #searchAllCategories';

    if(!term){
      term = '';
    }
	this.searchStr = term;
    this.isSearchNow = true;

    console.debug('#search pageSize=' + pagesize);

    console.time(timerName);
    await this.documentService.searchDocuments(this.userId, this.lang, this.db, this.category, term, pagesize)
      .then(documents => this.documents = documents);
    console.timeEnd(timerName);

    this.isSearchNow = false;

    return <any>Promise.resolve("Success");
  }

  deleteData(documentId: string): void {
    this.dialogsService
      .confirm('確認', 'データを削除しますか？', this.viewContainerRef)
      .subscribe(
	      result => {
	          if (result) {
                  this.userId = this.searchUserDb.split('_')[0];
                  this.lang = this.searchUserDb.split('_')[1];
                  this.db = this.searchUserDb.split('_')[2];
                  this.documentService.delete(this.userId, this.lang, this.db, this.category, documentId)
                  .then(result => {
                  	this.result = result;
					var document = this.documents.filter(element => {
               			return element._id == documentId;
            		});
                  	this.documents.splice(this.documents.indexOf(document[0]), 1);
                  	console.log("result : " + this.result);
                  });
              } else {
                  console.log("キャンセルです。");
              }
	          this.viewContainerRef = null;
          }
      );
  }

  editData(document: Document): void {
    this.documentEdit.emit(document);
  }

  onSelectCategory(category: string): void {
    this.category = category;
    this.categoryChange.emit(this.category);

    this.search(this.searchStr, this.pagesize);
  }

  async onClickLikeButton(documentId:string, increment: number): Promise<string> {
    await this.documentService.updateLike(this.userId, this.lang, this.db, this.category, documentId, increment);

    let term = this.searchStr;
    window.setTimeout(() => {
      this.search(term, this.pagesize);
    }, 500);

    return <any>Promise.resolve("Success");
  }

  onSelectPageSize(pageSize: string): void {
    this.search(this.searchStr, pageSize);
  }


  async addCategory(): Promise<string> {
  	this.userId = this.searchUserDb.split('_')[0];
    this.lang = this.searchUserDb.split('_')[1];
    this.db = this.searchUserDb.split('_')[2];
  	await this.categoryDetailService
      .add(this.userId, this.lang, this.db, this.viewContainerRef)
      .subscribe(
	      result => {
	          if (result) {
	              this.searchAllCategories();
              } else {
                  console.log("キャンセルです。");
              }
	          this.viewContainerRef = null;
          }
      );
    return <any>Promise.resolve("Success");
  }

}
