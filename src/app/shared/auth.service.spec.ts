/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {Oauth2Token} from "./entity/oauth2-token";

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should get token ...', inject([AuthService], (service: AuthService) => {

    var oauth2Token: Oauth2Token;

    service.getToken().then(token => oauth2Token = token);
    console.log('access_token=' + this.oauth2Token.access_token);

  }));


});
