import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = 'mkVrk83P6NdZtRt6kiKACZOjjPkkj3cv';
  private searchUrl: string = 'http://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
   }

  get tagsHistory() {
    return [...this._tagsHistory]; // los arreglos en JS pasan por referencia, entonces se usa el operador spreds para crear una copia de los valores del tagHistory
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
      // this._tagsHistory = this._tagsHistory.filter( function(oldTag) {
      //   oldTag !== tag
      // } );
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')! ); // se una el operador Non Null Operator ( ! )

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }


  // async searchTag(tag: string): Promise<void> {

  //   if(tag.length === 0) return;
  //   this.organizeHistory(tag);
  //   // console.log(this._tagsHistory);

  //   fetch('http://api.giphy.com/v1/gifs/search?api_key=mkVrk83P6NdZtRt6kiKACZOjjPkkj3cv&q=valorant&limit=10')
  //   .then( resp => resp.json()
  //   .then( data => console.log(data) ));

  //   const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=mkVrk83P6NdZtRt6kiKACZOjjPkkj3cv&q=valorant&limit=10');
  //   const data = resp.json();
  //   console.log(data);
  // }

  searchTag(tag: string): void {

    if(tag.length === 0) return;
    this.organizeHistory(tag);
    // console.log(this._tagsHistory);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    // this.http.get('http://api.giphy.com/v1/gifs/search?api_key=mkVrk83P6NdZtRt6kiKACZOjjPkkj3cv&q=valorant&limit=10')
    this.http.get<SearchResponse>(`${ this.searchUrl }/search`, { params })
    .subscribe( resp => {
      this.gifList = resp.data;
      console.log( { gisf: this.gifList } );
    } );

  }
}
