import {Injectable, NgZone} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from "lodash";

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class SpeechRecognitionService {
  speechRecognition: any;

  constructor(private zone: NgZone) { }

  ngOnInit(){
    console.log('lodash version:', _.VERSION);
  }


  langSpoken = 'en-US';
  changeLang(lang: string): void {
    this.langSpoken = lang;
//    console.log('%s is selected as recognition language', this.langSpoken);
  }

  record(): Observable<string> {

    return Observable.create(observer => {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();
      //this.speechRecognition = SpeechRecognition;
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
//      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.lang = this.langSpoken;
      this.speechRecognition.maxAlternatives = 1;

      console.log('this.speechRecognition.lang=', this.speechRecognition.lang);
      this.speechRecognition.onresult = speech => {
        let term: string = "";
        if (speech.results) {
          var result = speech.results[speech.resultIndex];
          var transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
              console.log("anything unrecognized - Please try again");
            }
            else {
              term = _.trim(transcript);
              console.log("recognized: " + term);
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
      console.log("Please say something - now recording...");
    });
  }

  stop() {
    if (this.speechRecognition)
      this.speechRecognition.stop();
  }

}
