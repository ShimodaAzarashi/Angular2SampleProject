/**
 * Created by saburoshiota on 2017/01/21.
 */


export class Oauth2Token {

  access_token: string = 'initial';
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;

}

// {
//   "access_token": "0ef383a5-1427-46fe-a360-2caae0cd9f8b",
//   "token_type": "bearer",
//   "refresh_token": "e170e589-ebef-4055-aa8b-7c76e0610146",
//   "expires_in": 119,
//   "scope": "read write trust"
// }
