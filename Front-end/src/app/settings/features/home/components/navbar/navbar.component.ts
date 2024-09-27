// Imports do Angular
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Serviço de autenticação
import { AuthService } from '../../../../core/security/services/auth/auth.service';

// Declaração de variável global para Google Maps
declare const google: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // Corrigido para 'styleUrls'
})
export class NavbarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef; // Referência ao campo de busca
  @ViewChild('map') mapElement: ElementRef | undefined; // Referência ao elemento do mapa
  map: any; // Instância do mapa
  searchTerm: string = ''; // Termo de busca

  constructor(private auth: AuthService, private router: Router) { }

  // Faz logout e redireciona para a página inicial
  logout() {
    this.auth.logout();
  }

  // Pesquisa e exibe o local no mapa
  search() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.searchTerm }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(14); // Ajuste o zoom conforme necessário

        // Adiciona um marcador no local encontrado (opcional)
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        // Lida com o caso em que a pesquisa não retorna resultados
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}
