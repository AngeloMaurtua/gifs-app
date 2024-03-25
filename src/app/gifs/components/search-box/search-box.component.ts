import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifts-search-box',
  template: `
    <h5>Buscar:</h5>
    <input type="text"
      class="form-control"
      placeholder="Buscar gifs..."

      (keyup.enter)="searchTag()"
      #txtTagInput
    >

    <!-- (keyup.enter)="searchTag( txtTagInput.value )" -->
  `
})
export class SearchBoxComponent {

  @ViewChild('txtTagInput') // solo toma un referencia local, el @ViewChildrem toma todos los input ... regresa un arreglo de elementos HTML
  public tagInput!: ElementRef<HTMLInputElement>; // siempre va tener un valor

  // searchTag(newTag: string) {
  //   console.log({newTag});
  // }

  constructor(private gifsService: GifsService){

  }

  searchTag() {
    const newTag: string = this.tagInput.nativeElement.value;
    //console.log({newTag});
    this.gifsService.searchTag(newTag);

    this.tagInput.nativeElement.value = '';
  }
}

