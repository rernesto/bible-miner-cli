import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RemoteApiService} from '../../services/remote-api.service';
import {IonContent, LoadingController, IonSlides} from '@ionic/angular';
import {Md5} from 'ts-md5';
import {DataService} from '../../services/router/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-read',
  templateUrl: './read.page.html',
  styleUrls: ['./read.page.scss'],
})
export class ReadPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('slider') private slider: IonSlides;

  messages: {[x: string]: any};
  bibleVersionValue: {[x: string]: any};
  bibleVersions = [];
  bibleBookValue: {[x: string]: any};
  bibleBooks = [];
  bibleChapterValue: {[x: string]: any};
  bibleChapters = [];
  bibleVerseNumberValue: {[x: string]: any};
  bibleVerseNumbers = [];
  currentVerseRecords = [];
  page: number = null;
  info: {[x: string]: any};
  idRefRegExp: RegExp = /\s|:/gi;

  constructor(
      private apiService: RemoteApiService,
      private loadingController: LoadingController,
      private translateService: TranslateService,
      private dataService: DataService,
      private router: Router
  ) {
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

  getSearchResultsByVerse(event) {
    const id =  Md5.hashStr('read');
    this.dataService.setData(id, {
      searchValue: event.target.innerHTML,
      bibleVersionValue: this.bibleVersionValue
    });
    this.router.navigateByUrl('/tabs/search/' + id);
  }

  getBibleBooks() {
    this.apiService.getBibleBooks(this.bibleVersionValue.language).subscribe(response => {
      this.bibleBooks = response;
      this.bibleBookValue = null;
      this.bibleChapterValue = null;
      this.bibleChapters = null;
      this.bibleVerseNumberValue = null;
      this.bibleVerseNumbers = null;
      this.currentVerseRecords = [];
      this.page = null;
    });
  }

  getBibleBookChapters() {
    if (this.bibleBookValue !== null) {
      this.apiService.getBibleBookChapters(this.bibleBookValue.id).subscribe(response => {
        this.bibleChapters = response;
        this.bibleChapterValue = {id: '1', chapter: '1'};
        this.bibleVerseNumberValue = {id: '1', verse: '1'};
        this.bibleVerseNumbers = null;
        this.page = null;
      });
    }
  }

  getBibleBookVerseNumbers() {
    if (this.bibleBookValue !== null && this.bibleChapterValue !== null) {
      this.apiService.getBibleBookVerseNumbers(this.bibleBookValue.id, this.bibleChapterValue.chapter).subscribe(response => {
        this.bibleVerseNumbers = response;
        this.bibleVerseNumberValue = {id: '1', verse: '1'};
        this.page = null;
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

  rotatePages() {
    this.slider.getActiveIndex().then( idx => {
      const sliderIndex = idx;
      let noChanges = false;
      if (sliderIndex <= 0) {
        this.page--;
        // Shift data to right
        if (this.page < 1) {
          this.page = 1;
          noChanges = true;
        }
      } else if (sliderIndex >= 2) {
        this.page++;
        // Shift data to left
        if (this.page > this.info.maxPage) {
          this.page = this.info.maxPage;
          noChanges = true;
        }
      }
      if (noChanges === true) {
        this.slider.slideTo(1, 0, false);
      } else {
        this.getVerseRecords();
      }
    });
  }

  goToBookMark() {
    this.page = null;
    this.getVerseRecords(true);
  }

  getVerseRecords(scrollToVerse: boolean = false) {
    if (this.bibleBookValue !== null) {
      this.presentLoading();
      setTimeout(async () => {
        await this.apiService.getBibleBookChapterVerses(
            this.bibleVersionValue.id,
            this.bibleBookValue.id,
            this.bibleChapterValue.id,
            this.bibleVerseNumberValue.id,
            this.page
        ).subscribe(response => {
          this.info = response.info;
          this.page = this.info.currentPage;
          this.currentVerseRecords = response.results;
          this.slider.slideTo(1, 0, false).then(() => {
            this.loadingController.dismiss().then(() => {
              if (scrollToVerse === true) {
                this.scrollToVerse();
              } else {
                this.content.scrollToTop();
              }
            });
          });
        });
      }, 500);
    }
  }

  scrollToVerse() {
    const element = this.bibleBookValue.shortName.toLowerCase() + '-' +
      this.bibleChapterValue.chapter + '-' + this.bibleVerseNumberValue.verse;
    const yOffset = document.getElementById(element).parentElement.offsetTop;
    this.content.scrollToPoint(0, yOffset, 1000);
  }
}
