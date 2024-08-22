import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';



/**
 * Componente responsável por exibir e gerenciar um mapa com estações de carregamento elétrico.
 * Utiliza a API do Google Maps para localizar e exibir marcadores para estações de carregamento próximas.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **ngAfterViewInit**: Este método é chamado após a visualização do componente ser inicializada. Ele carrega o script do Google Maps e, uma vez carregado, chama `initMap()` para configurar o mapa.
 * 2. **loadGoogleMapsScript**: Carrega dinamicamente o script da API do Google Maps se ainda não estiver carregado.
 * 3. **initMap**: Inicializa o mapa com opções específicas e configura a localização do usuário.
 * 4. **getUserLocation**: Obtém a localização do usuário e centraliza o mapa nessa localização. Em seguida, chama `searchNearbyChargingStations()` para buscar estações de carregamento próximas.
 * 5. **searchNearbyChargingStations**: Cria uma instância do serviço de Places e chama `performTextSearch()` para encontrar estações de carregamento próximas.
 * 6. **performTextSearch**: Realiza uma busca de texto para encontrar estações de carregamento elétrico e, para cada estação encontrada, chama `createMarkerForChargingStation()` para criar um marcador no mapa.
 * 7. **createMarkerForChargingStation**: Cria um marcador para uma estação de carregamento e adiciona ao mapa. Adiciona um listener de clique para exibir o modal com informações da estação.
 * 8. **showModal**: Exibe o modal com informações sobre a estação de carregamento. Calcula a distância entre a localização do usuário e a estação de carregamento e atualiza o estado do modal.
 * 9. **closeModal**: Fecha o modal principal.
 * 10. **showDetailsModal**: Exibe o modal de detalhes com informações adicionais sobre a estação de carregamento.
 * 11. **closeDetailsModal**: Fecha o modal de detalhes.
 * 12. **handleLocationError**: Lida com erros de localização se a geolocalização do navegador falhar.
 * 13. **calculateRouteDistance**: Calcula a distância entre a localização do usuário e a estação de carregamento e exibe essa distância no modal. Usa armazenamento de sessão para cache de distâncias.
 */
@Component({
  selector: 'app-map-stations',
  templateUrl: './map-stations.component.html',
  styleUrls: ['./map-stations.component.scss']
})
export class MapStationsComponent implements AfterViewInit {
  // Referências para elementos do DOM para o mapa e modais
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  @ViewChild('detailsModal', { static: false }) detailsModal!: ElementRef;

  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  userLocation: google.maps.LatLng | null = null;
  currentPlace: google.maps.places.PlaceResult | null = null;
  openNow: any = false; // Status de abertura da estação

  isModalOpen = false; // Estado do modal principal
  isDetailsModalOpen = false; // Estado do modal de detalhes
  modalTitle = ''; // Título do modal principal
  modalDistance = ''; // Distância da estação ao usuário
  detailsModalTitle = ''; // Título do modal de detalhes
  detailsModalAddress: string | null = null; // Endereço da estação
  detailsModalPhone: string | null = null; // Telefone da estação
  detailsModalRating: string | null = null; // Avaliação da estação
  detailsModalOpenStatus: string | null = null; // Status de abertura da estação


  constructor(private cdr: ChangeDetectorRef) {}

    /**
   * Método chamado após a visualização do componente ser inicializada.
   * Carrega o script do Google Maps e inicializa o mapa.
   */
  ngAfterViewInit() {
    this.loadGoogleMapsScript()
      .then(() => {
        this.initMap();
      })
      .catch(error => console.error('Erro ao carregar o script do Google Maps', error));
  }
  

  /**
   * Inicializa o mapa do Google Maps com opções específicas.
   */
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

  /**
   * Obtém a localização do usuário e centra o mapa nessa localização.
   * Busca estações de carregamento próximas após obter a localização.
   */
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

  
  /**
   * Carrega o script do Google Maps se ainda não estiver carregado.
   * @returns Promise que resolve quando o script é carregado.
   */
  async loadGoogleMapsScript(): Promise<void> {
    if (window['google'] && window['google'].maps) {
      // Google Maps já carregado
      return;
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


  /**
   * Busca estações de carregamento próximas à localização atual do mapa.
   */
  searchNearbyChargingStations() {
    const service = new google.maps.places.PlacesService(this.map);
    this.performTextSearch(service);
  }

  /**
   * Realiza uma busca de texto para encontrar estações de carregamento elétrico.
   * @param service Serviço de Places do Google Maps.
   */
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


  /**
   * Remove todos os marcadores do mapa.
   */
  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }


  /**
   * Cria um marcador para uma estação de carregamento e adiciona ao mapa.
   * @param place Informações sobre a estação de carregamento.
   */
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



  /**
   * Exibe o modal com informações sobre a estação de carregamento.
   * @param place Informações sobre a estação de carregamento.
   */
  showModal(place: google.maps.places.PlaceResult) {
    console.log(place)
    this.modalTitle = place.name || 'Estação de carregamento';
    this.modalDistance = ''; // Resetar a distância, se necessário
  
    // Calcule a distância se a localização do usuário e o local estiverem disponíveis
    if (this.userLocation && place.geometry && place.geometry.location) {
      this.calculateRouteDistance(this.userLocation, place.geometry.location);
    }
  
    this.isModalOpen = true; // Defina a variável para abrir o modal
    this.openNow = place.opening_hours; // Defina a variável de abertura
    this.cdr.detectChanges(); // Força a verificação de mudanças
    console.log(this.isModalOpen)
  }
  

  /**
   * Fecha o modal principal.
   */
  closeModal() {
    this.isModalOpen = false; // Defina a variável para fechar o modal
    this.cdr.detectChanges(); // Força a verificação de mudanças
  }
  

  /**
   * Exibe o modal de detalhes com informações adicionais sobre a estação de carregamento.
   */
  showDetailsModal() {
    if (this.currentPlace) {
      this.detailsModalTitle = this.currentPlace.name || 'Detalhes do Posto';
      this.detailsModalAddress = this.currentPlace.vicinity ? `Endereço : ${this.currentPlace.vicinity}` : null;
      this.detailsModalPhone =  this.currentPlace.formatted_phone_number ? `Telefone : ${this.currentPlace.formatted_phone_number}` : null;
      this.detailsModalRating = this.currentPlace.rating ? `Avaliação : ${this.currentPlace.rating} estrelas` : null;
      this.detailsModalOpenStatus = this.currentPlace.opening_hours ? "Aberto agora" : "Fechado agora";
    
      this.isDetailsModalOpen = true;
      this.cdr.detectChanges();
    } else {
      console.warn('currentPlace is null, cannot show details.');
    }
  }
  

  /**
   * Fecha o modal de detalhes.
   */
  closeDetailsModal() {
    this.isDetailsModalOpen = false; // Feche o modal de detalhes
    this.cdr.detectChanges();
  }


  /**
   * Lida com erros de localização se a geolocalização do navegador falhar.
   * @param browserHasGeolocation Indica se o navegador suporta geolocalização.
   * @param pos Coordenadas da localização padrão para centralizar o mapa.
   */
  handleLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng) {
    // Implementar lógica de erro
  }



  /**
   * Calcula a distância entre a localização do usuário e a estação de carregamento.
   * @param origin Localização do usuário.
   * @param destination Localização da estação de carregamento.
   */
  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng) {
    const directionsService = new google.maps.DirectionsService();
  
    // Verificar se a rota já foi calculada e armazenada
    const cachedDistance = sessionStorage.getItem(`route_${startLocation}_${destination}`);
    if (cachedDistance) {
      this.modalDistance = cachedDistance;
      this.cdr.detectChanges();
      return;
    }
  
    directionsService.route({
      origin: startLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }).then(response => {
      const distanceText = "Distância: " + response.routes[0].legs[0].distance!.text;
      this.modalDistance = distanceText;
      
      // Armazenar a rota calculada para uso futuro
      sessionStorage.setItem(`route_${startLocation}_${destination}`, distanceText);
      
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Erro ao calcular a rota:', error);
      this.modalDistance = "Erro ao calcular a distância.";
      this.cdr.detectChanges();
    });
  }
  
}
