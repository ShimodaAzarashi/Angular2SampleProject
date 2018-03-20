import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Rmr2Env} from "./rmr2env";
import {Http, Headers, Response} from "@angular/http";
import {Oauth2Token} from "./entity/oauth2-token";
import { Company }      from './entity/company';

@Injectable()
export class AuthService {

  constructor(private http: Http,
              private rmr2Env: Rmr2Env) { }

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  private loginCompany: Company = null;
  isLoggedIn: boolean = false;

  static KEY_STORAGE_MY_COMPANY = 'MyCompany';
  static KEY_STORAGE_UI_TOKEN = 'UiToken';


  async login(email :string, password :string): Promise<boolean> {

//    this.getCompanyFromMock(email, password);
    let ret: boolean = await this.login2server(email, password);
    if(!ret){
      return Observable.of(false).toPromise();
    }
    this.loginCompany = await this.getCompanyFromServer(email);

    if( this.loginCompany == null ) {
      return Observable.of(false).delay(500).do(val => this.isLoggedIn = false).toPromise();
    }
    sessionStorage.setItem(AuthService.KEY_STORAGE_MY_COMPANY, JSON.stringify(this.loginCompany));

    return Observable.of(true).delay(500).do(val => this.isLoggedIn = true).toPromise();
  }

  logout(): void {
    sessionStorage.removeItem(AuthService.KEY_STORAGE_MY_COMPANY);
    // TODO notice logged-out to the ui server
    this.isLoggedIn = false;
  }


  // helpers ------------
  private UI_TOKEN_ENDPOINT: string = this.rmr2Env.getApiServer() +  "/rmr2ui/token";
  private UI_LOGIN_ENDPOINT: string = this.rmr2Env.getApiServer() +  "/rmr2ui/login/process";

  async login2server(email :string, password :string) {

    if (!email) return null;
    if (!password) return null;

    let body = 'username=' + email + '&password=' + password;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post(this.UI_LOGIN_ENDPOINT, body, {headers: headers})
      .toPromise()
      .then((res)=> {
//        console.debug('#login2server / res.status=' + res.status);
        if(res.status == 200){

//          console.log('res='+res.json().token);
          sessionStorage.setItem(AuthService.KEY_STORAGE_UI_TOKEN, res.json().token);

          return Observable.of(true).toPromise;
        } else {
          return Observable.of(false).toPromise;
        }
      })
      .catch(initialError => {
        return this.handleError(initialError);
      });

  }

  async getCompanyFromServer(email :string): Promise<Company> {

    if (!email) return null;

    let path = email.replace('@','_at_').replace(/\./g,'_dot_');
//    console.debug('sanitizedLoginId=' + path);

    let url = this.rmr2Env.getApiServer() + '/rmr2ui/companies/' + path;
    let headers = new Headers();
    // for CORS
    headers.append('X-Auth-Token', sessionStorage.getItem(AuthService.KEY_STORAGE_UI_TOKEN));

    return this.http
//      .get(url)
      .get(url, {headers: headers})
      .toPromise()
      .then((res)=> {
        if(res.status == 200){
          return res.json().data as Company;
        }
      })
      .catch(error => {
        if(error.status == 403){
          console.warn('Unauthorized. Please check if your id is suspended by administrator.');
          return null;
        }
        return this.handleError(error);
      });
  }


  // OAuth2 --------------------

  private AUTHORIZATION_ENDPOINT: string = this.rmr2Env.getApiServer() +  "/oauth2/token";

  //private username : string = 'my-trusted-client';
  //private password : string = 'secret';

  private username : string = 'regain-trusted-server';
  private password : string = 'eimah8Ia5sohkeis';

  private oauth2Token: Oauth2Token;
  private refresh_token: string;


  async getToken(): Promise<string> {
    return await this.requestToken(false);
  }

  async refreshToken(): Promise<string> {
    return await this.requestToken(true);
  }

  private retryCounter: number = 0
  async requestToken(needsRefresh: boolean): Promise<string> {

    if( !needsRefresh && this.oauth2Token ){
      return this.oauth2Token.access_token;
    }

    let myCompany: Company = JSON.parse(sessionStorage.getItem(AuthService.KEY_STORAGE_MY_COMPANY));

    // actually temporary values those will be expired after logged out
    let a = myCompany.authentication_id;
    let b = myCompany.secret_key;

    var body = 'grant_type=password&username=' + a + '&password=' + b;
    if( needsRefresh ){
      body = 'grant_type=refresh_token&refresh_token=' + this.oauth2Token.refresh_token;
    }

    let headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http
      .post(this.AUTHORIZATION_ENDPOINT, body, {headers: headers})
      .toPromise()
      .then((res)=> {
        this.oauth2Token = this.extractTokenData(res);
        this.refresh_token = this.oauth2Token.refresh_token;
        this.retryCounter = 0;
        return this.oauth2Token.access_token;
      })
      .catch(initialError => {
        // when refresh_token expired(HTTP 400), needs to request new token after removing old token
        if (initialError && 2 > this.retryCounter) {
          this.retryCounter++;
          this.oauth2Token = null;
          this.refresh_token = null;
          console.log('remove existing token...' + this.oauth2Token + '/' + this.refresh_token);
          return this.requestToken(false);
        }
        else {
          return this.handleError(initialError);
        }
      });

  }

  private extractTokenData(res: Response) {

    let body = res.json();
    var oauth2Token = new Oauth2Token();

    // TODO improve
    // though thinking of jquery Expand, angular2 recommend not to use jquery...
    if(body.access_token) { oauth2Token.access_token = body.access_token; }
    if(body.token_type) { oauth2Token.token_type = body.token_type; }
    if(body.refresh_token) { oauth2Token.refresh_token = body.refresh_token; }
    if(body.expires_in) { oauth2Token.expires_in = body.expires_in; }
    if(body.scope) { oauth2Token.scope = body.scope; }

    return oauth2Token;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred at calling rmr2 api: ', error);
    console.trace();
    return Promise.reject(error.message || error);
  }


}
