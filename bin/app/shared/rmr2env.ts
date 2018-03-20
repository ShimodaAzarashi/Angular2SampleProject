import {Injectable} from "@angular/core";

@Injectable()
export class Rmr2Env {

  apiSv: string = 'http://localhost:8080';
//  apiSv: string = 'https://rmr2-demo-api-v1-2-2.alt-dev.io';
//  apiSv: string = 'https://regain-v1-2-2-ui.alt-dev.io';
//  apiSv: string = 'https://rmr2-goushi.alt-dev.io';

  synonymSv: string = 'https://synonym.alt-dev.io/synonym';
//  synonymSv: string = 'https://synonym-v0-5-1.alt-dev.io/synonym';

  getApiServer(): string {
    return this.apiSv;
  }

  getSynonymServer(): string {
    return this.synonymSv;
  }
}
