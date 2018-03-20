import {Component, OnInit, Input, EventEmitter, Output, ViewContainerRef} from '@angular/core';
import {MdIconRegistry} from "@angular/material";
import { SynonymService } from "../shared/synonym.service";
import { Synonym } from "../shared/entity/synonym";
import { SynonymGroup } from "../shared/entity/synonym-group";
import { SynonymSearch } from "../shared/entity/synonym-search";
import {DbService} from "../shared/db.service";
import {DialogsService} from "../dialog/dialogs.service";
import {DomSanitizer} from "@angular/platform-browser";
import {DictionaryDetailService} from "./dictionary-detail.service";
import { Lang } from '../shared/entity/lang';
import { Company } from '../shared/entity/company';
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
  providers: [DialogsService, DictionaryDetailService]
})
export class DictionaryComponent implements OnInit {

  public result: any;
  
  currentCompany: Company = null;
  
  dictionarys: string;
  wikis: string;
  mlwords: string;
  manualwords: string;

  @Input()
  synonymGroup: SynonymGroup[] = new Array(0);

//  @Input()
 // editSynonym: string;

  @Input()
  selectLang: string;

  langs: Lang[] = new Array(0);

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
    private synonymService: SynonymService,
    private dbService: DbService,
    private dialogsService: DialogsService,
    private dictionaryDetailService: DictionaryDetailService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
      this.currentCompany = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));
      this.userId = this.currentCompany.prefix;
  	
	  this.langs.push(new Lang("日本語", "ja"));
      this.langs.push(new Lang("英語", "en"));
      this.selectLang = this.langs[0].value;
      
      this.searchSynonymGroup("");
  }

  search(term: string): Promise<string> {
    if(!term){
      alert('検索キーワードを入力してください。');
      return <any>Promise.resolve("NG");
    }
	this.dictionarys = "";
    this.wikis = "";
    this.mlwords = "";
    this.manualwords = "";
  
	this.synonymService.searchSynonymByWordnet(this.selectLang, term)
	  .then(result => {
	    if(result.data && result.data_size > 0) {
	  		this.dictionarys = result.data.join("、");
	  	}
	  } 
	);
	this.synonymService.searchSynonymByWiki(this.selectLang, term)
	  .then(result => {
	    if(result.data && result.data_size > 0) {
	    	this.wikis = result.data.join("、");
	    }
	  } 
	);
	this.synonymService.searchSynonymByMl(this.userId, this.selectLang, term)
	  .then(result => {
	    if(result.data && result.data_size > 0) {
	  	  this.mlwords = result.data.join("、");
	  	}
	  } 
	);
	this.synonymService.searchSynonymByManual(this.userId, this.selectLang, term)
	  .then(result => {
	    if(result.data && result.data_size > 0) {    
	  	    this.manualwords = result.data.join("、");
	  	}
	  } 
	);
    return <any>Promise.resolve("Success");
  }
  
  searchManual(term: string): Promise<string> {
    this.searchSynonymGroup(term);
    return <any>Promise.resolve("Success");
  }
  
  searchSynonymGroup(term): Promise<string> {
  	this.synonymService.searchSynonymManualAll(this.userId, this.selectLang)
	  .then(result => {
	    if(this.synonymGroup.length > 0){
			this.synonymGroup.splice(0, this.synonymGroup.length);
		}
	    if(result.data && result.data_size > 0) {
	 　		for(var groupId in result.data) {
	 			let isFirst = true;
	 			let sg = new SynonymGroup();
	 			sg.id = groupId;
	 			sg.dataSize = ""+result.data[groupId].length;
	 			var isTermGroup = false;
	 			for (var i = 0; i < result.data[groupId].length; i++) {
					let word = result.data[groupId][i];
		  			let s = new Synonym();
		  			s.synset = groupId;
		  			s.isFirstRow = false;
		  			if(isFirst) {
			  			s.isFirstRow = true;
			  			isFirst = false;
		  			}
		  			s.isEditing = false;
					s.word = word;
					s.wordOld = word;
					if(term && s.word === term) { 
				    	isTermGroup = true;
					}
					sg.synonym.push(s);
				}
				if(term) { 
					if(isTermGroup){
						this.synonymGroup.push(sg);
					}
				} else {
					this.synonymGroup.push(sg);
				}
		  	}
	  	}
	  	console.log(this.synonymGroup);
	  } 
	);
    return <any>Promise.resolve("Success");
  }
  
  addSynonymGroup(): Promise<string> {
  	this.dictionaryDetailService
      .addDictionary(this.userId, this.selectLang, this.viewContainerRef)
      .subscribe(
	      result => {
	      	  console.log(result);
	          if (result) {
	          	this.searchSynonymGroup("");
              }
	          this.viewContainerRef = null;
          }
      );
    return <any>Promise.resolve("Success");
  }
  
  deleteSynonymGroup(synonym) : Promise<string> {
    this.synonymService.deleteSynonymGroup(this.userId, this.selectLang, synonym.synset)
	  .then(result => {
		console.log(result);
		this.searchSynonymGroup("");
	  } 
	);
    return <any>Promise.resolve("Success");
  }
  
  addSynonym(synonym) : Promise<string> {
  	this.dictionaryDetailService
      .addSynonym(this.userId, this.selectLang, synonym.synset, this.viewContainerRef)
      .subscribe(
	      result => {
	      	  console.log(result);
	          if (result) {
	          	this.searchSynonymGroup("");
              }
	          this.viewContainerRef = null;
          }
    );
    return <any>Promise.resolve("Success");
  }
  
  editSynonym(synonym) : Promise<string> {
	synonym.isEditing = true;
    return <any>Promise.resolve("Success");
  }
  
  cancelSynonym(synonym) : Promise<string> {
	synonym.isEditing = false;
	synonym.word = synonym.wordOld;
    return <any>Promise.resolve("Success");
  }
  
  saveSynonym(synonym) : Promise<string> {
  　if(synonym.word === synonym.wordOld) {
		this.cancelSynonym(synonym);
	} else {
	  	this.synonymService.addSynonym(this.userId, this.selectLang, synonym.synset, synonym.word)
		  .then(result => {
		    this.synonymService.deleteSynonym(this.userId, this.selectLang, synonym.synset, synonym.wordOld)
			  .then(result => {
				console.log(result);
				this.searchSynonymGroup("");
			  } 
			);	
		  } 
		);
	}
    return <any>Promise.resolve("Success");
  }
  
  deleteSynonym(synonym) : Promise<string> {
    this.synonymService.deleteSynonym(this.userId, this.selectLang, synonym.synset, synonym.word)
	  .then(result => {
		console.log(result);
		this.searchSynonymGroup("");
	  } 
	);
    return <any>Promise.resolve("Success");
  }
}
