import {Component, OnInit, Input} from '@angular/core';

import { Document } from '../shared/entity/document';
import { DocumentService } from '../shared/document.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {

  document: Document = {
    _id: '',
    encryptId: '',
    question: '',
    answer: '',
    posted: '',
    last_update: '',
    like: 0,
    _score: 0,
    user_session: '',
    user_question: '',
    base_id: '',
    check: ''
  };

  @Input()
  updateUserDb: string;

  @Input()
  updateCategory: string;

  userId: string;
  lang: string;
  db: string;

  editDocument: Document;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
  }

  save(): void {
    this.userId = this.updateUserDb.split("_")[0];
    this.lang = this.updateUserDb.split("_")[1];
    this.db = this.updateUserDb.split("_")[2];

    if(this.document._id != '') {
          this.documentService.update(this.userId, this.lang, this.db, this.updateCategory, this.document._id, this.document.question, this.document.answer)
            .then(result => {
          });
          this.editDocument.question = this.document.question;
          this.editDocument.answer = this.document.answer;
    } else {
        this.documentService.create(this.userId, this.lang, this.db, this.updateCategory, this.document.question, this.document.answer)
          .then(result => {
        });
    }
    this.clear();
  }

  edit(document): void {
    this.document._id = document._id;
    this.document.question = document.question;
    this.document.answer = document.answer;
    this.editDocument  = document;
  }

  clear(): void {
    this.document._id = '';
    this.document.question = '';
    this.document.answer = '';
  }

}
