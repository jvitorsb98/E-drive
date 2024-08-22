import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-stations',
  templateUrl: './map-stations.component.html',
  styleUrls: ['./map-stations.component.scss']
})
export class MapStationsComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  @ViewChild('detailsModal', { static: false }) detailsModal!: ElementRef;

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  userLocation: google.maps.LatLng | null = null;
  currentPlace: google.maps.places.PlaceResult | null = null;
  openNow :any = false;

  isModalOpen = false; // Inicialmente fechado
  isDetailsModalOpen = false;
  isClosed = false;
  modalTitle = '';
  modalDistance = '';
  detailsModalTitle = '';
  detailsModalAddress = '';
  detailsModalPhone = '';
  detailsModalRating = '';
  detailsModalOpenStatus = '';

  ngAfterViewInit() {
    this.loadGoogleMapsScript()
      .then(() => {
        this.initMap();
      })
      .catch(error => console.error('Erro ao carregar o script do Google Maps', error));
  }
  


  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -21.780, lng: -47.534 }, // Coordenadas de exemplo
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
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

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.getUserLocation();
    this.map.addListener('idle', () => this.searchNearbyChargingStations());
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(this.userLocation);
          this.searchNearbyChargingStations();
        },
        () => this.handleLocationError(true, this.map.getCenter()!)
      );
    } else {
      this.handleLocationError(false, this.map.getCenter()!);
    }
  }

  

  async loadGoogleMapsScript(): Promise<void> {
    if (window['google'] && window['google'].maps) {
      // Google Maps já carregado
      return;
    }
  
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBttstn5kDru-LuCZ22fiWR9qTFP6lzk8A&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  searchNearbyChargingStations() {
    const service = new google.maps.places.PlacesService(this.map);
    this.performTextSearch(service);
  }

  performTextSearch(service: google.maps.places.PlacesService) {
    const location = this.map.getCenter();
    const query = 'estação de carregamento elétrico';
    const radius = 30000;

    service.textSearch({
        query: query,
        location: location,
        radius: radius
    }, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            this.clearMarkers();
            results.forEach(place => {
                this.createMarkerForChargingStation(place);
            });
        } else {
            console.error('Erro ao buscar estações de carregamento:', status);
        }
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  createMarkerForChargingStation(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) {
      console.warn('Place geometry or location is undefined:', place);
      return;
    }

    const iconUrl = place.opening_hours ? "../../../../assets/images/station_open.svg" : "../../../../assets/images/station_closed.svg"

    const marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      title: place.name || '',
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30)
      }
    });

    this.markers.push(marker);

    marker.addListener('click', () => {
      this.currentPlace = place;
      this.showModal(place);
    });
  }

  showModal(place: google.maps.places.PlaceResult) {
    console.log(place)
    this.modalTitle = place.name || 'Estação de carregamento';
    this.modalDistance = ''; // Resetar a distância, se necessário
  
    // Calcule a distância se a localização do usuário e o local estiverem disponíveis
    if (this.userLocation && place.geometry && place.geometry.location) {
      this.calculateRouteDistance(this.userLocation, place.geometry.location);
    }
  
    this.isModalOpen = true; // Defina a variável para abrir o modal
    console.log(this.isModalOpen)
    this.openNow = place.opening_hours; // Defina a variável de abertura
  }
  
  closeModal() {
    this.isModalOpen = false; // Defina a variável para fechar o modal
  }
  
  showDetailsModal() {
    if (this.currentPlace) {
      this.detailsModalTitle = this.currentPlace.name || 'Detalhes do Posto';
      this.detailsModalAddress = "Endereço: " + (this.currentPlace.vicinity || "Não disponível");
      this.detailsModalPhone = "Telefone: " + (this.currentPlace.formatted_phone_number || "Não disponível");
      this.detailsModalRating = "Avaliação: " + (this.currentPlace.rating ? this.currentPlace.rating + " estrelas" : "Não disponível");
      this.detailsModalOpenStatus = this.currentPlace.opening_hours ? "Aberto agora" : "Fechado agora";
    
      this.isDetailsModalOpen = true; // Abra o modal de detalhes
      this.openNow = this.currentPlace.opening_hours; // Defina a variável de abertura
    } else {
      console.warn('currentPlace is null, cannot show details.');
    }
  }
  
  closeDetailsModal() {
    this.isDetailsModalOpen = false; // Feche o modal de detalhes
  }



  handleLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng) {
    // Implementar lógica de erro
  }

  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng) {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route({
      origin: startLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.modalDistance = "Distância: " + response!.routes[0].legs[0].distance!.text;
      } else {
        console.error('Erro ao calcular a rota:', status);
        this.modalDistance = "Erro ao calcular a distância.";
      }
    });
  }
}
