import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, IonContent} from '@ionic/angular';
import {RemoteApiService} from '../services/remote-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(private apiService: RemoteApiService) {
    // this.searchValue = 'principio dios creo cielo';
    this.bibleVersionValue = 2;
    this.page = 1;
  }
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  searchValue: string;
  bibleVersionValue: number;
  page: number;
  records = [];
  bibleVersions = [];
  info: any;

  static compareWith(o1, o2): boolean {
    console.log('comparing');
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  ngOnInit() {
    this.apiService.getBibleVersions().subscribe(response => {
      this.bibleVersions = response;
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
      this.apiService.searchData(
        this.searchValue, this.bibleVersionValue, this.page
      ).subscribe(response => {
        this.records = this.records.concat(response.results);
        this.info = response.info;
        this.page = this.info.currentPage;
        this.content.scrollToTop();
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
}
