import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  messages: {[x: string]: any};
  content: {[x: string]: any};

  constructor(private translateService: TranslateService) { this.initTranslator(); }

  ngOnInit() {
  }

  async initTranslator() {
    this.translateService.setDefaultLang('en');

    if (this.translateService.getBrowserLang() !== undefined) {
      this.translateService.use(this.translateService.getBrowserLang());
    } else {
      this.translateService.use('en'); // Set your language here
    }

    await this.translateService.get('messages').subscribe(trans => {
      this.messages = trans;
    });

    await this.translateService.get('content').subscribe(trans => {
      this.content = trans;
    });
  }

}
