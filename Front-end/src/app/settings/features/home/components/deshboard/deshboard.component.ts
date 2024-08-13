import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrl: './deshboard.component.scss'
})
export class DeshboardComponent implements AfterViewInit {

  @ViewChild('map') mapElement: ElementRef | undefined;
  map: any;
  searchTerm: string = '';

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const mapOptions = {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
  }

  

}
