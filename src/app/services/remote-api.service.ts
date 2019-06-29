import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteApiService {

  url = 'https://api.bible-miner.org/api/';

  constructor(private http: HttpClient) { }

  searchData(searchQuery: string, bibleVersion: number, page: number = 1): Observable<any> {
    return this.http.get(
        `${this.url}bible_verses/search_ranked?search_query=${encodeURI(searchQuery)}` +
        `&bible_version=${bibleVersion}&page=${page}`
    );
  }

  getBibleVersions(): Observable<any> {
    return this.http.get(
        `${this.url}bible_versions`
    );
  }
}
