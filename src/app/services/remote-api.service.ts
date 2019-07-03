import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemoteApiService {

  // url = 'http://localhost:8000/api/';
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
        `${this.url}bible_versions/localized`
    );
  }

  getBibleBooks(language: string): Observable<any> {
    return this.http.get(
        `${this.url}bible_books/localized?language=${language}`
    );
  }

  getBibleBookChapters(bookId: number): Observable<any> {
    return this.http.get(
        `${this.url}bible_verses/chapters?book_id=${bookId}`
    );
  }

  getBibleBookVerseNumbers(bookId: number, chapter: number): Observable<any> {
    return this.http.get(
        `${this.url}bible_verses/verses?book_id=${bookId}&chapter=${chapter}`
    );
  }

  getBibleBookChapterVerses(versionId: number, bookId: number, chapter: number, verse: number): Observable<any> {
    return this.http.get(
        `${this.url}bible_verses/read?version=${versionId}&book=${bookId}&chapter=${chapter}&verse=${verse}`
    );
  }
}
