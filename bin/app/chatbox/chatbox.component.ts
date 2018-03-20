import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Document } from '../shared/entity/document';
import { DocumentService } from "../shared/document.service";
import { SpeechRecognitionService } from '../shared/speech-recognition.service';
import { SpeechSynthesisService } from '../shared/speech-synthesis.service';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit, AfterViewChecked  {
  @ViewChild('scrollChat') private scrollContainer: ElementRef;

  chats: Array<Document> = new Array(0);

  @Input()
  chatUserDb: string;

  @Input()
  chatCategory: string;

  userId: string;
  lang: string;
  db: string;

  isScroll: boolean = false;
  showSearchButton: boolean;
  speechData: string;

  constructor(private documentService: DocumentService,
              private speechRecognitionService: SpeechRecognitionService,
              private speechSynthesisService: SpeechSynthesisService
  ) {
    this.showSearchButton = true;
    this.speechData = "";
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
	if(this.isScroll) {
		this.isScroll = false;
	  	this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  	}
  }

  moveScroll(){
    this.isScroll = true;
  }

  onPushSendButton(userQuestion: string){
    this.search(userQuestion);
  }


  ngOnDestroy(){
    this.speechRecognitionService.stop();
  }



  search(userQuestion: string): void {

    if(!userQuestion){
//      console.debug('userQuestion is empty');
      return;
    }

    this.userId = this.chatUserDb.split("_")[0];
    this.lang = this.chatUserDb.split("_")[1];
    this.db = this.chatUserDb.split("_")[2];
	//this.db = this.chatUserDb.slice(this.chatUserDb.indexOf('_', this.chatUserDb.indexOf('_'))+1);

    this.documentService.searchTopDocument(this.userId, this.lang, this.db, this.chatCategory, userQuestion, "10")
      .then(document => {
        if(document.question) {
          document.user_question = userQuestion;

        	this.chats.push(document)
          if(this.readerSwitchOn){
            this.speechSynthesisService.speak(document.answer);
          }

        } else {
          let doc = new Document();
          doc.user_question = userQuestion;
          if(this.lang.match('ja')){
            doc.answer = 'すみません、分かりません';
          } else {
            doc.answer = 'Sorry, I don\'t understand your question.';
          }
          this.chats.push(doc);
          if(this.readerSwitchOn){
            this.speechSynthesisService.speak(doc.answer);
          }

        }
        this.moveScroll();
      });
  }


  // ----- speech interface -----
  langSupported = [
    {value: 'ja-JP', viewValue: '日本語'},
    {value: 'en-US', viewValue: '英語（米国）'},
    {value: 'fr-FR', viewValue: 'フランス語'}
  ];


  onSelectLang(lang: string): void {
    console.debug('#onSelectLang[IN] ... lang=%s', lang);
    this.speechRecognitionService.changeLang(lang);
    this.speechSynthesisService.changeLang(lang);
  }

  readerSwitchOn : boolean = false;
  onChangeReaderToggle(checked: boolean): void {
    this.readerSwitchOn = checked;
  }

  micSwitchOn: boolean = false;
  onChangeMicToggle(checked: boolean): void {
    this.micSwitchOn = checked;
    if(this.micSwitchOn){
      this.activateSpeechSearch();
    } else {
      this.deactivateSpeechSearch();
    }
  }

  activateSpeechSearch(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.speechData = value;
//          console.log(value);
          this.search(value);
        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            if(this.micSwitchOn){
              this.activateSpeechSearch();
            }
          }
        },
        //completion
        () => {
          this.showSearchButton = true;
          console.log("--recording completed/stopped--");
          if(this.micSwitchOn){
            this.activateSpeechSearch();
          }
        });
  }

  deactivateSpeechSearch(): void {
    this.speechRecognitionService.stop();
  }


}
