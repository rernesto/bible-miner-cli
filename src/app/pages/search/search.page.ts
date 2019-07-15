import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonContent, LoadingController} from '@ionic/angular';
import {RemoteApiService} from '../../services/remote-api.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

// export interface BibleVersion {
//   id: number;
//   name: string;
// }

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  searchValue: string;
  page: number;
  records = [];
  bibleVersionValue: {[x: string]: any};
  bibleVersions = [];
  info: any;
  messages: {[x: string]: any};

  constructor(
      private apiService: RemoteApiService,
      private loadingController: LoadingController,
      private translateService: TranslateService,
      private route: ActivatedRoute
  ) {

    if (this.translateService.getBrowserLang() === 'en') {
      this.bibleVersionValue = { id: 1 };
    } else if (this.translateService.getBrowserLang() === 'es') {
      this.bibleVersionValue = { id: 2 };
    } else {
      this.bibleVersionValue = { id: 1 };
    }
    this.page = 1;

    this.initTranslator();
  }

  compareWithFn(o1, o2): boolean {
    console.log('comparing');
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  ngOnInit() {
    this.apiService.getBibleVersions().subscribe(response => {
      this.bibleVersions = response;
    });
  }

  ionViewWillEnter() {
    if (this.route.snapshot.data.routeParams) {
      this.searchValue = this.route.snapshot.data.routeParams.searchValue;
      this.bibleVersionValue = this.route.snapshot.data.routeParams.bibleVersionValue;
      this.getSearchResults(this.infiniteScroll);
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

  getSearchResultsByVerse(record) {
    this.searchValue = record.verse_text;
    this.getSearchResults(this.infiniteScroll);
  }

  getSearchResults(event) {
    setTimeout(() => {
      this.page = 1;
      this.records = [];
      this.info = {};
      this.presentLoading();
      this.apiService.searchData(
        this.searchValue, this.bibleVersionValue.id, this.page
      ).subscribe(response => {
        this.records = this.records.concat(response.results);
        this.info = response.info;
        this.page = this.info.currentPage;
        this.content.scrollToTop();
        this.loadingController.dismiss();
        this.route.snapshot.data.routeParams.searchValue = this.searchValue;
        this.route.snapshot.data.routeParams.bibleVersionValue = this.bibleVersionValue;
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
            this.searchValue, this.bibleVersionValue.id, this.page
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
