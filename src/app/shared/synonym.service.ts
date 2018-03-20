import { Injectable } from '@angular/core';
import {Http, RequestOptions, URLSearchParams, RequestMethod, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Synonym } from './entity/synonym';
import { SynonymGroup } from './entity/synonym-group';
import { SynonymSearch } from './entity/synonym-search';
import {AuthService} from "./auth.service";
import {Rmr2Env} from "./rmr2env";
import {Like} from "./entity/like";
import {InquiryParam} from "./entity/inquiry-param";

@Injectable()
export class SynonymService {

  private synonymSv: string = this.rmr2Env.getSynonymServer();
  private wordnetRoot = '/dic';
  private wikipediaRoot = '/wiki';
  private mlRoot =  '/ml';
  private manualRoot =  '/manual';
  private retryCounter: number = 0;
  
 // synonyms: Synonym[] = new Array(0);

  constructor(
    private http: Http,
    private authService: AuthService,
    private rmr2Env: Rmr2Env
  ) { }

  searchSynonymByWordnet(lang: string, term: string): Promise<SynonymSearch> {
//    let access_token: string = this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	let params: URLSearchParams = new URLSearchParams();
 	params.set('w', term.trim() );
    var options = new RequestOptions({
      method: RequestMethod.Get,
      headers: headers,
      search: params
    });

    var url: string = this.synonymSv + this.wordnetRoot ;
//    var url: string = this.synonymSv + this.wordnetRoot + "/" + lang ;

    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        return response.json() as SynonymSearch;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchSynonymByWordnet(lang, term);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

  searchSynonymByWiki(lang: string, term: string): Promise<SynonymSearch> {
//    let access_token: string = this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	let params: URLSearchParams = new URLSearchParams();
 	params.set('w', term.trim() );
    var options = new RequestOptions({
      method: RequestMethod.Get,
      headers: headers,
      search: params
    });

    var url: string = this.synonymSv + this.wikipediaRoot;
//    var url: string = this.synonymSv + this.wikipediaRoot + "/" + lang;
    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        return response.json() as SynonymSearch;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchSynonymByWiki(lang, term);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

  searchSynonymByMl(userId: string, lang: string, term: string): Promise<SynonymSearch> {
//    let access_token: string = this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	let params: URLSearchParams = new URLSearchParams();
 	params.set('w', term.trim() );
    let options = new RequestOptions({
      method: RequestMethod.Get,
      headers: headers,
      search: params
    });
    var url: string = this.synonymSv  + "/" + userId + "/" + lang + this.mlRoot;
    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        return response.json() as SynonymSearch;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchSynonymByMl(userId, lang, term);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }
  
  
  searchSynonymByManual(userId: string, lang: string, term: string): Promise<SynonymSearch> {
//    let access_token: string = this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	let params: URLSearchParams = new URLSearchParams();
 	params.set('w', term.trim() );
    var url: string = this.synonymSv  + "/" + userId + "/" + lang + this.manualRoot;
    
	let options = new RequestOptions({
        method: RequestMethod.Get,
        headers: headers,
        search: params
    });
    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        return response.json() as SynonymSearch;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchSynonymByManual(userId, lang, term);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }
  
  
  searchSynonymManualAll(userId: string, lang: string): Promise<SynonymSearch> {
//    let access_token: string = this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	var url: string = this.synonymSv  + "/" + userId + "/" + lang + this.manualRoot + "/all?page=0&size100";
	var options = new RequestOptions({
		method: RequestMethod.Get,
        headers: headers,
    });
    return this.http.get(url, options)
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        return response.json() as SynonymSearch;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.searchSynonymManualAll(userId, lang);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }
  
  generateGroupId(groupData: string[]): string {
	var newId = 0;
	for(var groupId in groupData) {
		let maxId = parseInt(groupId.substr(1));
		if (maxId > newId) {
			newId = maxId;
		}
	}
	return "M" + ("0000"+(newId+1)).slice(-5);
  }

  addSynonymGroup(userId: string, lang: string, word: string): Promise<string> {
	let url: string = this.synonymSv  + "/" + userId + "/" + lang;
//    let access_token: string = await this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	
	return this.searchSynonymManualAll(userId, lang)
	  .then(result => {
    	let newGroupId = this.generateGroupId(result.data);
		let data = '[{"synset":"' + newGroupId + '","word":"' + word + '"}]';
	    return this.http
	      .post(url, data, {headers: headers})
	      .toPromise()
	      .then((response) => {
	        this.retryCounter = 0;
	      })
	      .catch(initialError => {
	        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
	          this.retryCounter++;
	          // token will be expired, try to refresh token.
	          return this.authService.refreshToken().then((res) => {
	            if (res) {
	              return this.addSynonymGroup(userId, lang, word);
	            }
	            return <any>Promise.reject(initialError);
	          });
	        }
	        else {
	          return <any>Promise.reject(initialError);
	        }
	      });
     });
       
  }

  deleteSynonymGroup(userId: string, lang: string, synset: string): Promise<string> {
	let url: string = this.synonymSv  + "/" + userId + "/" + lang + "/" + synset;
//    let access_token: string = await this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;

      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.deleteSynonymGroup(userId, lang, synset);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }
  

  addSynonym(userId: string, lang: string, synset: string, word: string): Promise<string> {
	let url: string = this.synonymSv  + "/" + userId + "/" + lang + "/" + synset + "/" + word;
//    let access_token: string = await this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	
	return this.searchSynonymManualAll(userId, lang)
	  .then(result => {
    	let newGroupId = this.generateGroupId(result.data);
		let data = '[{"synset":"' + newGroupId + '","word":"' + word + '"}]';
	    return this.http
	      .put(url, {headers: headers})
	      .toPromise()
	      .then((response) => {
	        this.retryCounter = 0;
	
	      })
	      .catch(initialError => {
	        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
	          this.retryCounter++;
	          // token will be expired, try to refresh token.
	          return this.authService.refreshToken().then((res) => {
	            if (res) {
	              return this.addSynonym(userId, lang, synset, word);
	            }
	            return <any>Promise.reject(initialError);
	          });
	        }
	        else {
	          return <any>Promise.reject(initialError);
	        }
	      });
     });
       
  }

  deleteSynonym(userId: string, lang: string, synset: string, word: string): Promise<string> {
	let url: string = this.synonymSv  + "/" + userId + "/" + lang + "/" + synset + "/" + word;
//    let access_token: string = await this.authService.getToken();
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
	
    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;

      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.deleteSynonym(userId, lang, synset, word);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred at calling rest api: ', error);
    console.trace();
    return Promise.reject(error.message || error);
  }
}
