import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

declare const google: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('map') mapElement: ElementRef | undefined;
  map: any;
  searchTerm: string = '';

  constructor() { }

  search() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.searchTerm }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(14); // Ajuste o zoom conforme necessário

        // Adicione um marcador no local encontrado (opcional)
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        // Lide com o caso em que a pesquisa não retorna resultados
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
