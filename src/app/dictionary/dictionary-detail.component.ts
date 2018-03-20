import { MdDialogRef } from '@angular/material';
import { OnInit, Component } from '@angular/core';
import { Http, Request, Response} from '@angular/http';
import { Lang } from '../shared/entity/lang';
import {DbService} from "../shared/db.service";
import { SynonymService } from "../shared/synonym.service";
import { Synonym } from "../shared/entity/synonym";

@Component({
  selector: 'dictionary-detail',
  templateUrl: './dictionary-detail.component.html',
  styleUrls: ['./dictionary-detail.component.css']
})

export class DictionaryDetail {
	public isError: boolean = false;
	public errorMessage: string = '';

    public userId: string;
    public lang: string;
    public synset: string;
    public word: string = '';
	public isSynonym: boolean = false;

    constructor(
    	private synonymService: SynonymService,
        public dialogRef: MdDialogRef<DictionaryDetail>
    ) {}
	
	ngOnInit() {
		if(this.synset) {
			this.isSynonym = true;
		}
	}
	
    addDictionary() {
	    var createResult: boolean = false;
    	this.synonymService.addSynonymGroup(this.userId, this.lang, this.word)
	      .then(res => {
			  console.log(res);

	        window.setTimeout(() => {
	    	  this.dialogRef.close(true);
	        }, 500);
        });
    }
    
    addSynonym() {
    	this.synonymService.addSynonym(this.userId, this.lang, this.synset, this.word)
	      .then(res => {

	    	// create databaseを待ち合わせて、少し経ってからクローズする
	        window.setTimeout(() => {
	    	  this.dialogRef.close(true);
	        }, 500);
        });
    }

    cancel() {
    	this.dialogRef.close();
    }
}
