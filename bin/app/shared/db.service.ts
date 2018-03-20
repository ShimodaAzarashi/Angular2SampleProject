import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, RequestMethod} from "@angular/http";
import {Rmr2Env} from "./rmr2env";
import {AuthService} from "./auth.service";
import {Company} from "./entity/company";

@Injectable()
export class DbService {

  private webApiSv: string = this.rmr2Env.getApiServer();
  private apiRoot = '/rmr2';
  private uiRoot = '/rmr2ui';
  private qafunc =  '/qa-pairs';

  private retryCounter: number = 0;

  constructor(private http: Http,
              private authService: AuthService,
              private rmr2Env: Rmr2Env) { }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred at calling rest api: ', error);
    console.trace();
    return Promise.reject(error.message || error);
  }

  async searchAllDb(dbName :string): Promise<string[]> {
    var url = this.webApiSv + this.uiRoot + '/dbs/' + dbName;

    let access_token: string = await this.authService.getToken()
    let headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(response => response.json().data as string[])
      .catch(this.handleError);
  }

  searchAllCategories(userId :string, lang :string, db :string): Promise<string[]> {
    var url = this.webApiSv + this.uiRoot + '/dbs/' + userId + '/' + lang + '/' + db;

    let headers = new Headers();
    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(response => response.json().data as string[])
      .catch(this.handleError);
  }

  searchAllCategoriesWithUserDb(userId: string, lang: string, db: string): Promise<string[]> {
    return this.searchAllCategories(userId, lang, db);
  }

  // account methods ----------------------------------------------------------------------------

  async createChildAccount(userId :string, company :Company): Promise<Company> {

    console.debug('#createChildAccount [IN] userId=' + userId + 'company.loginId=' + company.login_id);

    let access_token: string = await this.authService.getToken()

    let url: string = this.webApiSv + this.apiRoot
      + '/account/' + userId;

    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .post(url, JSON.stringify(company), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
console.log(response);

        if( 200 <= response.status && response.status < 300){
          return response.json().data as Company;
        }
        return false;
//        return response.json();
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.createChildAccount(userId, company);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
          //        return <any>Promise.reject(initialError);
        }
      });
  }

  async rePasswordChildAccount(userId :string, company :Company): Promise<Company> {

    console.debug('#rePasswordChildAccount [IN] userId=' + userId);

    let access_token: string = await this.authService.getToken()
    let url: string = this.webApiSv + this.apiRoot + '/account/' + userId + '/password';
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .put(url, JSON.stringify(company), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return response.json().data as Company;
        }
        return false;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.rePasswordChildAccount(userId, company);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
          //        return <any>Promise.reject(initialError);
        }
      });
  }

  async reissueCredential(userId :string, company :Company): Promise<Company> {

    console.debug('#reissueCredential [IN] userId=' + userId);

    let access_token: string = await this.authService.getToken()
    let url: string = this.webApiSv + this.apiRoot + '/account/' + userId + '/credential/';
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .put(url, JSON.stringify(company), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return response.json().data as Company;
        }
        return false;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.reissueCredential(userId, company);
            }
            return initialError;
          });
        }
        else {
          return initialError;
        }
      });
  }


  async deleteChildAccount(userId :string, childUserId: string): Promise<boolean> {

    console.debug('#deleteChildAccount [IN] userId=' + userId + ', childUserId=' + childUserId);

    let access_token: string = await this.authService.getToken()

    let url: string = this.webApiSv + this.apiRoot
      + '/account/' + userId + '/' + childUserId;

    let headers = new Headers();
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return true;
        }
        return false;
//        return response.json();
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.deleteChildAccount(userId, childUserId);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
          //        return <any>Promise.reject(initialError);
        }
      });
  }

  async listAccount(userId :string): Promise<Company[]> {

    console.debug('#listAccount [IN] userId=' + userId);

    let access_token: string = await this.authService.getToken()
    let url: string = this.webApiSv + this.apiRoot + '/account/' + userId;
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);

    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return response.json().data as Company[];
        }
        var acc : Company[] = new Array(0);
        return acc;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.listAccount(userId);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
          //        return <any>Promise.reject(initialError);
        }
      });
  }




  // database methods ----------------------------------------------------------------------------

  async createDatabase(userId :string, lang: string, db: string): Promise<boolean> {

    let access_token: string = await this.authService.getToken()

    let url: string = this.webApiSv + this.apiRoot
      + '/dbs/' + userId + '/' + lang  + '/' + db;

    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .put(url, JSON.stringify({}), {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return true;
        }
        return false;
//        return response.json();
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.createDatabase(userId, lang, db);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
          //        return <any>Promise.reject(initialError);
        }
      });
  }

  async deleteDatabase(userId :string, lang: string, db: string): Promise<boolean> {
    let access_token: string = await this.authService.getToken()
    let url: string = this.webApiSv + this.apiRoot
      + '/dbs/' + userId + '/' + lang  + '/' + db;

    // TODO delete content-type
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization','Bearer ' + access_token);
//    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .delete(url, {headers: headers})
      .toPromise()
      .then((response) => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return true;
        }
        return false;
//        return response.json();
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.deleteDatabase(userId, lang, db);
            }
            return <any>Promise.reject(initialError);
          });
        }
        else {
          return <any>Promise.reject(initialError);
        }
      });
  }

// category methods ----------------------------------------------------------------------------

  async createCategory(userId :string, lang: string, db: string, category: string): Promise<boolean> {

    let access_token: string = await this.authService.getToken()

    var url: string = this.webApiSv + this.uiRoot
      + '/dbs/' + userId + '/' + lang + '/' + db + '/' + category;

    var headers = new Headers({'Content-Type': 'application/json'});
//    headers.append('Authorization','Bearer ' + access_token);
    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
      .put(url, JSON.stringify({}), {headers: headers})
      .toPromise()
      .then(response => {
        this.retryCounter = 0;
        if( 200 <= response.status && response.status < 300){
          return true;
        }
        return false;
//        return response;
      })
      .catch(initialError => {
        if (initialError && initialError.status === 401 && 3 > this.retryCounter) {
          this.retryCounter++;
          // token will be expired, try to refresh token.
          return this.authService.refreshToken().then((res) => {
            if (res) {
              return this.createCategory(userId, lang, db, category);
            }
            return initialError;
//            return <any>Promise.reject(initialError);
          });
        }
        else {
          return initialError;
//          return <any>Promise.reject(initialError);
        }
      });
  }

  async addQAData(userId :string, lang: string, db: string, fileType: string, formData: FormData) : Promise<string> {

    let self = this;
    console.log("addQAData [IN]");

    await self.authService.refreshToken();
    let access_token: string = await this.authService.getToken();
    var url: string = this.webApiSv + this.apiRoot
      + this.qafunc + '/' + userId + '/' + lang + '/' + db + '/' + fileType +'/upload';

    return new Promise<string>(
      function(resolve, reject) {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("enctype", "multipart/form-data"); // enctype For Multipart Request
        xhr.setRequestHeader("Cache-Control", "no-cache");      // IE bug fixes to clear cache
        xhr.setRequestHeader("Cache-Control", "no-store");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
//        xhr.setRequestHeader("X-Auth-Token", sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));
        xhr.send(formData);

        xhr.onreadystatechange = () => {

          if(xhr.readyState === 4) {
            // 認証エラーの場合
            if( xhr.status == 401 && 3 > self.retryCounter ){

              self.retryCounter++;
              console.log("refreshToken start... retryCounter=" + self.retryCounter);
              self.authService.refreshToken().then((res) => {
                if (res) {
                  console.log("refreshToken end... token=" + res);
                  return self.addQAData(userId, lang, db, fileType, formData);
                }
                resolve(xhr.response); // rejectしない。呼出元で、statusを確認
              });
              // 認証エラー以外の場合
            } else {
//              console.log("xhr.response=" + xhr.response);
              // statusは、200系正常の場合の他に、500系エラーなども含む
              console.log("authentication passed... self.retryCounter=" + self.retryCounter);
              self.retryCounter = 0;
              resolve(xhr.response); // rejectしない。呼出元で、statusを確認
              // このあと、２回以上ネストした関数の呼出結果（xhr.response）が、呼出元に戻らないため、
              // 最初から決め打ちでrefreshTokenを実行する簡易な対処とした
            }
          }
        }
      }
    );
  }

}
