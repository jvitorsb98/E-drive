import { ElementRef, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  constructor(
  ) { }

  async initMap(mapContainer: ElementRef): Promise<google.maps.Map> {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -21.780, lng: -47.534 }, // Coordenadas de exemplo
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // Estilos personalizados do mapa, se necessário
      styles: [
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            { "visibility": "on" },
            { "color": "#444444" }
          ]
        },
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "on" },
            { "lightness": 5 }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            { "color": "#a4c8e1" }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "color": "#D3D3D3" },
            { "lightness": 0 }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            { "lightness": 15 },
            { "saturation": -10 }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "lightness": 0 }
          ]
        }
      ]
        };

    this.map = new google.maps.Map(mapContainer.nativeElement, mapOptions);

    // Inicializa os serviços de direções
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map); // Define o mapa no DirectionsRenderer


    return this.map;
  }

  loadGoogleMapsScript(): Promise<void> {
    if (window['google'] && window['google'].maps) {
      // Google Maps já carregado
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  
  
  
}
