import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Document } from '../shared/entity/document';
import { DocumentDetailComponent }  from '../document-detail/document-detail.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  @ViewChild(DocumentDetailComponent)
  private detail: DocumentDetailComponent;

  userDb: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.userDb = params['userDb']);
    this.userDb = this.route.snapshot.params['userDb'];
  }

  edit(document): void {
    this.detail.edit(document);
  }

}
