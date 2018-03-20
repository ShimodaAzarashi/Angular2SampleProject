import { Injectable } from '@angular/core';
import {Http, RequestOptions, URLSearchParams, RequestMethod, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Document } from './entity/document';
import {AuthService} from "./auth.service";
import {Rmr2Env} from "./rmr2env";
import {Like} from "./entity/like";
import {InquiryParam} from "./entity/inquiry-param";

@Injectable()
export class DocumentService {

  private webApiSv: string = this.rmr2Env.getApiServer();
  private funcRoot = '/rmr2';
  private uiRoot = '/rmr2ui';
  private qafunc =  '/qa-pairs';

  private retryCounter: number = 0;

  constructor(
    private http: Http,
    private authService: AuthService,
    private rmr2Env: Rmr2Env
  ) { }


  async create(userId :string, lang: string, db: string, category: string, question: string, answer: string): Promise<string> {

    let url: string = this.webApiSv + this.funcRoot + this.qafunc
       + '/' + userId + '/' + lang + '/' + db + '/' + category;

    let access_token: string = await this.authService.getToken()
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

	let document: Document = {
	    _id: '',
	    encryptId: '',
	    question: question,
	    answer: answer,
	    posted: '',
	    last_update: '',
	    like: 0,
	    _score: 0,
	    user_session: '',
	    user_question: '',
	    base_id: '',
        check:''
	};

    return this.http
      .post(url, JSON.stringify(document), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
//        return response.json() as string;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.create(userId, lang, db, category, question, answer);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });

  }

  async update(userId :string, lang: string, db: string, category: string, docid: string, question: string, answer: string): Promise<string> {

    let url: string = this.webApiSv + this.funcRoot + this.qafunc
      + '/' + userId + '/' + lang + '/' + db + '/' + category + '/' + docid;

    let access_token: string = await this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

	  let document: Document = {
	    _id: docid,
	    encryptId: '',
	    question: question,
	    answer: answer,
	    posted: '',
	    last_update: '',
	    like: 0,
	    _score: 0,
	    user_session: '',
	    user_question: '',
	    base_id: '',
      check: ''
//      check: 'true'
	  };

    return this.http
      .put(url, JSON.stringify(document), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
//        return response.json() as string;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.update(userId, lang, db, category, docid, question, answer);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

  async delete(userId :string, lang: string, db :string, category :string, documentId :string): Promise<string> {

    let access_token: string = await this.authService.getToken()

    var url: string = this.webApiSv + this.funcRoot + this.qafunc
      + '/' + userId + '/' + lang + '/' + db + '/' + category + '/' + documentId;

    var headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
//        return response.json() as string;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.delete(userId, lang, db, category, documentId);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

  async updateLike(userId :string, lang: string, db: string, category: string, documentId: string, increment: number): Promise<string> {

    let access_token: string = await this.authService.getToken()

    var url: string = this.webApiSv + this.funcRoot + this.qafunc
      + '/' + userId + '/' + lang + '/' + db + '/' + category + '/' + documentId + '/like';

    var headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

    var likeObj: Like = new Like();
    likeObj.increment = increment;

    return this.http
      .patch(url, JSON.stringify(likeObj), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
//        return response.json() as string;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.updateLike(userId, lang, db, category, documentId, increment);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });

  }



  async exportQAData(userId :string, lang: string, db: string, category: string): Promise<Document[]> {
    let access_token: string = await this.authService.getToken();
    var url: string = this.webApiSv + this.funcRoot
      + this.qafunc + '/' + userId + '/' + lang + '/' + db + '/' + category + '/download';

	var headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
	  .get(url, {headers: headers})
      .toPromise()
      .then(response => {
        this.retryCounter = 0;
        return response.json().data as Document[];
 //       return response.json().data as Document[];
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.exportQAData(userId, lang, db, category);
            }
            return initialError;
          });
        }
        else {
			return initialError;
        }
      });
  }



  // search methods ----------------------------------------------------------------------------

  searchDocumentsWithUserDb(userDb :string, category: string, term: string, pagesize: string): Promise<Document[]> {
    let userId = userDb.split('_')[0];
    let lang = userDb.split('_')[1];
    let db = userDb.split('_')[2];

    return this.searchDocuments(userId, lang, db, category, term, pagesize);
  }

  // adapter
  async searchDocuments(userId :string, lang: string, db: string, category: string, term: string, pagesize: string): Promise<Document[]> {

    if( !category ){
      console.debug("category is undefined. category=" + category);
      var docs : Document[] = new Array(0);
      return docs;
//      return <any>Promise.resolve("category is undefined. skip to access server");
    }

    if( !term || term.trim().length < 1 ){
      return this.searchDocumentsByAngular(userId, lang, db, category, term, pagesize, false);
    }

//    return this.searchDocumentsByAngular(userId, lang, db, category, term, pagesize, false);
    return this.searchDocumentsByAngularThroughPost(userId, lang, db, category, term, pagesize, false);
  }

  // TODO correct cast from [] to obj
  searchTopDocument(userId :string, lang: string, db: string, category: string, term: string, pagesize: string): Promise<Document> {
    return this.searchDocumentsByAngular(userId, lang, db, category, term, pagesize, true);
  }


  async searchDocumentsByAngular(userId :string, lang: string, db: string, category: string, term: string, pagesize: string, needsOnlyTop: boolean): Promise<Document[]> {

    let access_token: string = await this.authService.getToken()

    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

	let params: URLSearchParams = new URLSearchParams();
 	params.set('q', term.trim() );
 	params.set('count', pagesize);
    var options = new RequestOptions({
      method: RequestMethod.Get,
      // Angular2 Httpモジュールでは、Getメソッドはbodyは送信されないので、設定しても意味なし。代わりにURLパラメータで送信する
      headers: headers,
      search: params
    });

    var url: string = this.webApiSv + this.funcRoot + this.qafunc
       + '/' + userId + '/' + lang + '/' + db + '/' + category;
    if( needsOnlyTop ){
      url += '/top';
      // options = new RequestOptions({
      //   search: 'count='+ pagesize
      // });
    } else if( !term || term.trim().length < 1 ){
      url += '/all';
      options = new RequestOptions({
        headers: headers,
        search: params
      });
    }
    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        // not mandatory to care the empty data like below
        // if( response.json().data_size > 0 ){
        //   return response.json().data as Document[];
        // }
        if(needsOnlyTop){
          return response.json().data as Document;
        }
        return response.json().data as Document[];
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchDocumentsByAngular(userId, lang, db, category, term, pagesize, needsOnlyTop);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }


  async searchDocumentsByAngularThroughPost(userId :string, lang: string, db: string, category: string, term: string, pagesize: string,
                                            needsOnlyTop: boolean): Promise<Document[]> {

    let access_token: string = await this.authService.getToken()

    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

    console.debug('#searchDocumentsByAngularThroughPost pagesize=', pagesize);

    let params: InquiryParam = new InquiryParam();
    params.query = term.trim();
    params.count = +pagesize;

    console.debug('#searchDocumentsByAngularThroughPost params.count=', params.count);

    var url: string = this.webApiSv + this.funcRoot + this.qafunc
      + '/' + userId + '/' + lang + '/' + db + '/' + category;
    if( needsOnlyTop ){
      url += '/top';
    } else if( !term || term.trim().length < 1 ){
      url += '/all';
    }
    url += '/_GET';
    return this.http
//      .get(url, options)
      .post(url, JSON.stringify(params), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        // not mandatory to care the empty data like below
        // if( response.json().data_size > 0 ){
        //   return response.json().data as Document[];
        // }
        if(needsOnlyTop){
          return response.json().data as Document;
        }
        return response.json().data as Document[];
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchDocumentsByAngularThroughPost(userId, lang, db, category, term, pagesize, needsOnlyTop);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }


  // ----------------------------------------------------------------------
  // Please preserve code below for reference even if not used. (from here)
  // Direct operation on Elasticsearch

  searchDocumentsByEs(term: string): Promise<Document[]> {

    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });

    return client.search({
      index: 'alt_ja_dev',
      type: 'general',
      body: {
        query: {
          multi_match: {
            type: 'most_fields',
            query: term,
            fields: ['question', 'answer']
          }
        }
      }
    }).then(function (resp) {

      console.debug('promise.then is called...');
      console.debug('resp.hits.total=' + resp.hits.total);

      var docs: Document[] = [];

      for (var i=0; i<resp.hits.total; i++){
        console.debug('hits[' + i + ']._source.question=' + resp.hits.hits[i]._source.question);

        var doc = new Document();
        doc.question = resp.hits.hits[i]._source.question;
        doc.answer = resp.hits.hits[i]._source.answer;
        doc.posted = resp.hits.hits[i]._source.posted;
        doc.like = resp.hits.hits[i]._source.liked;
        doc._score = resp.hits.hits[i]._score;

        docs.push(doc);
      }
      return docs;

    }, function (err) {
      console.debug(err.message);
    }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred at calling rest api: ', error);
    console.trace();
    return Promise.reject(error.message || error);
  }

  // (preservation section end)
  // ----------------------------------------------------------------------

}
