import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DbService } from "../shared/db.service";
import { DatabaseDetailService } from "../database/database-detail.service";
import { Company }      from '../shared/entity/company';
import { Document } from '../shared/entity/document';
import { DocumentService } from "../shared/document.service";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-dataupload',
  templateUrl: './dataupload.component.html',
  styleUrls: ['./dataupload.component.css'],
  providers: [DatabaseDetailService, DatePipe]
})
export class DataUploadComponent implements OnInit {

  @ViewChild('upFile')
  upFile: any;

  @Input()
  selectUserDb: string;

  @Input()
  selectDownloadCategory: string = 'all';

  @Input()
  uploadFileType: string;

  @Input()
  fileType: string;

  uploadErrorList: string[];
  errorMessage: string = '';
  
  userDbs: string[];
  downloadCategories: string[];
  currentCompany: Company = null;
  userId: string = '';
  userDb: string = '';
  lang: string;
  db: string;
  uploadFileName: string;
 
  formData: FormData;
  messageUplode: string = '';
  messageDownload: string = '';

  constructor(
    private dbService: DbService,
    private databaseDetailService: DatabaseDetailService,
    private documentService: DocumentService,
    private viewContainerRef: ViewContainerRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.currentCompany = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
    this.userId = this.currentCompany.prefix;
    this.searchAllDbs();
  }

  searchAllDbs(): void {
    this.dbService.searchAllDb(this.userId)
      .then(userDbs => {
      	this.userDbs = [];
		for(var dbname in userDbs) {
			let userDb = userDbs[dbname];
			this.userDbs.push(userDb.slice(userDb.indexOf('_')+1));
		}
      });
  }

  onSelectDatabase(userDb: string){
  	this.lang = userDb.split('_')[0];
    this.db = userDb.slice(userDb.indexOf('_')+1);
   	this.downloadCategories = [];
  	this.dbService.searchAllCategoriesWithUserDb(this.userId, this.lang, this.db)
      .then(categories => {
      	this.downloadCategories = categories;
      	}
      );
  }

  onFileChange(event) {  
	let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        this.formData = new FormData();
        this.formData.append('uploadFile', file, file.name);
        this.uploadFileName = file.name;
    }
  }

  onPushUploadButton() {
	this.errorMessage = '';
	this.messageUplode = '未処理';
  	
  	if(!this.selectUserDb) {
  		alert("Databaseを選択してください！");
  		return;
  	}
  	if(!this.uploadFileType) {
  		alert("フォーマットを選択してください！");
  		return;
  	}
  	if(!this.uploadFileName) {
  		alert("ファイルを選択してください！");
  		return;
  	}
    this.dbService.addQAData(this.userId, this.lang, this.db, this.uploadFileType, this.formData)
      .then(response => {
	      let result = JSON.parse(response);
	      if(result.data) {
		      this.messageUplode = '成功 ' + result.data.cntSuccess + '件、失敗 ' + result.data.cntFail + '件です。';
	      }
	      if(result.errorMessage) {
		      this.errorMessage = result.errorMessage;
	      }
	      if(result.errorCsv) {
		      this.downloadCsvFile(result.errorCsv, "ERROR_" + this.uploadFileName);
	      }
   	      this.uploadFileName = '';
   	      this.upFile.nativeElement.value = "";
  		  this.formData = null;
    });
  }

  onPushDownloadButton() {
  	if(!this.selectUserDb) {
  		alert("Databaseを選択してください！");
  		return;
  	}
    this.documentService.exportQAData(this.userId, this.lang, this.db, this.selectDownloadCategory)
      .then(result => {
          this.messageDownload = '';
    	  if(result) {
	    	  this.downloadCsvFile(result, this.getFileName() + ".csv");
      	  } else {
      	  	this.messageDownload = "該当データがありません。";
      	  }
    });
  }

  downloadCsvFile(csvData, fileName){
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var blob = new Blob([bom, csvData], {"type": "text/csv;charset=utf-8;"});
    
	if (window.navigator.msSaveOrOpenBlob) {
	  // for ie
	  window.navigator.msSaveOrOpenBlob(blob, fileName);
	} else {
	  // for chrome (and safari)
	  var link = document.createElement('a');
	  link.setAttribute('download', fileName);
	  link.setAttribute('href', window.URL.createObjectURL(blob));
	  link.click();
	}
  }
  
  getFileName() {
	let dt =this.datePipe.transform(new Date(), 'yyyyMMddhhmmss');
    return this.userId + "_" + this.lang + "_" + this.db + "_" + this.selectDownloadCategory + "_" + dt;
  }

}
