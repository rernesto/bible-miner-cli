import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonContent, LoadingController} from '@ionic/angular';
import {RemoteApiService} from '../../services/remote-api.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  searchValue: string;
  bibleVersionValue: number;
  page: number;
  records = [];
  bibleVersions = [];
  info: any;
  messages: {[x: string]: any};

  constructor(private apiService: RemoteApiService,
              private loadingController: LoadingController,
              private translateService: TranslateService) {

    if (this.translateService.getBrowserLang() === 'en') {
      this.bibleVersionValue = 1;
    } else if (this.translateService.getBrowserLang() === 'es') {
      this.bibleVersionValue = 2;
    } else {
      this.bibleVersionValue = 1;
    }
    this.page = 1;

    this.initTranslator();
  }

  static compareWith(o1, o2): boolean {
    console.log('comparing');
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  ngOnInit() {
    this.apiService.getBibleVersions().subscribe(response => {
      this.bibleVersions = response;
    });
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

  getSearchResultsByVerse(event) {
    this.searchValue = event.target.innerHTML;
    this.getSearchResults(this.infiniteScroll);
  }

  getSearchResults(event) {
    setTimeout(() => {
      this.page = 1;
      this.records = [];
      this.info = {};
      this.presentLoading();
      this.apiService.searchData(
        this.searchValue, this.bibleVersionValue, this.page
      ).subscribe(response => {
        this.records = this.records.concat(response.results);
        this.info = response.info;
        this.page = this.info.currentPage;
        this.content.scrollToTop();
        this.loadingController.dismiss();
      });
    }, 500);
  }

  loadMore(event) {
    this.page++;
    if (this.page > this.info.maxPage) {
      event.target.complete();
    } else {
      setTimeout(() => {
        this.apiService.searchData(
            this.searchValue, this.bibleVersionValue, this.page
        ).subscribe(response => {
          this.records = this.records.concat(response.results);
          this.info = response.info;
          event.target.complete();
        });
      }, 500);
    }
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
}
