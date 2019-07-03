import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RemoteApiService} from '../../services/remote-api.service';
import {IonInfiniteScroll, IonContent, LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-read',
  templateUrl: './read.page.html',
  styleUrls: ['./read.page.scss'],
})
export class ReadPage implements OnInit {

  // @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  messages: {[x: string]: any};
  bibleVersionValue: {[x: string]: any};
  bibleVersions = [];
  bibleBookValue: {[x: string]: any};
  bibleBooks = [];
  bibleChapterValue: {[x: string]: any};
  bibleChapters = [];
  bibleVerseNumberValue: {[x: string]: any};
  bibleVerseNumbers = [];
  verseRecords = [];
  page: number;
  info: {[x: string]: any};

  constructor(private apiService: RemoteApiService,
              private loadingController: LoadingController,
              private translateService: TranslateService) {
    if (this.translateService.getBrowserLang() === 'en') {
      this.bibleVersionValue = { id: 1 };
    } else if (this.translateService.getBrowserLang() === 'es') {
      this.bibleVersionValue = { id: 2 };
    } else {
      this.bibleVersionValue = { id: 1 };
    }

    this.initTranslator();
  }

  compareWithFn(o1, o2): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  ngOnInit() {
    this.apiService.getBibleVersions().subscribe(response => {
      this.bibleVersions = response;
    });
    this.apiService.getBibleBooks(this.translateService.getBrowserLang()).subscribe(response => {
      this.bibleBooks = response;
    });
  }

  getBibleBooks() {
    this.apiService.getBibleBooks(this.bibleVersionValue.language).subscribe(response => {
      this.bibleBooks = response;
      this.bibleBookValue = null;
      this.bibleChapterValue = null;
      this.bibleChapters = null;
      this.bibleVerseNumberValue = null;
      this.bibleVerseNumbers = null;
      this.verseRecords = [];
    });
  }

  getBibleBookChapters() {
    if (this.bibleBookValue !== null) {
      this.apiService.getBibleBookChapters(this.bibleBookValue.id).subscribe(response => {
        this.bibleChapters = response;
        this.bibleChapterValue = null;
        this.bibleVerseNumberValue = null;
        this.bibleVerseNumbers = null;
      });
    }
  }

  getBibleBookVerseNumbers() {
    if (this.bibleBookValue !== null && this.bibleChapterValue !== null) {
      this.apiService.getBibleBookVerseNumbers(this.bibleBookValue.id, this.bibleChapterValue.chapter).subscribe(response => {
        this.bibleVerseNumbers = response;
        this.bibleVerseNumberValue = null;
      });
    }
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
  }

  async presentLoading() {

    const loading = await this.loadingController.create({
      message: `${this.messages.loading}`,
      // duration: 2000,
      spinner: 'dots'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }


  getVerseRecords() {
    if (this.bibleBookValue !== null && this.bibleChapterValue !== null && this.bibleVerseNumberValue !== null) {
      this.presentLoading();
      setTimeout(() => {
        this.apiService.getBibleBookChapterVerses(
            this.bibleVersionValue.id,
            this.bibleBookValue.id,
            this.bibleChapterValue.id,
            this.bibleVerseNumberValue.id
        ).subscribe(response => {
          this.verseRecords = response.results;
          this.info = response.info;
          this.page = this.info.currentPage;
          this.content.scrollToTop();
          this.loadingController.dismiss();
        });
      }, 500);
    }
  }

  // loadMoreDown(event) {
  //   this.page++;
  //   if (this.page > this.info.maxPage) {
  //     event.target.complete();
  //   } else {
  //     setTimeout(() => {
  //       this.apiService.getBibleBookChapterVerses(
  //           this.bibleVersionValue.id,
  //           this.bibleBookValue.id,
  //           this.bibleChapterValue.id,
  //           this.bibleVerseNumberValue.id
  //       ).subscribe(response => {
  //         this.verseRecords = this.verseRecords.concat(response.results);
  //         this.info = response.info;
  //         this.page = this.info.currentPage;
  //         event.target.complete();
  //       });
  //     }, 500);
  //   }
  // }
  //
  // loadMoreTop(event) {
  //   this.page--;
  //   if (this.page > this.info.maxPage) {
  //     event.target.complete();
  //   } else {
  //     setTimeout(() => {
  //       this.apiService.getBibleBookChapterVerses(
  //           this.bibleVersionValue.id,
  //           this.bibleBookValue.id,
  //           this.bibleChapterValue.id,
  //           this.bibleVerseNumberValue.id
  //       ).subscribe(response => {
  //         this.verseRecords = this.verseRecords.concat(response.results);
  //         this.info = response.info;
  //         this.page = this.info.currentPage;
  //         event.target.complete();
  //       });
  //     }, 500);
  //   }
  // }
}
