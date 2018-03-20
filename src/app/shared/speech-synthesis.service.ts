import {Injectable, NgZone} from '@angular/core';

interface IWindow extends Window {
  webkitSpeechSynthesis: any;
  SpeechSynthesis: any;
  SpeechSynthesisUtterance: any;
}

@Injectable()
export class SpeechSynthesisService {
  speechSynthesis: any;

  constructor(private zone: NgZone) {
    if ('speechSynthesis' in window) {
      console.log('Your browser supports speech synthesis.');
    } else {
      alert('Sorry! Your browser does not support speech synthesis. Try this on' +
        ' <a href="https://www.google.com/chrome/browser/desktop/index.html">Google Chrome</a>.');
    }
  }

  ngOnInit(){
  }

  langSpoken = 'en-US';
  changeLang(lang: string): void {
    this.langSpoken = lang;
    console.log('%s is selected as spoken language', lang)
  }

  speak(text: string): void {
    const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;

    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.langSpoken;
    (<any>window).speechSynthesis.speak(utterance);
  }

}
