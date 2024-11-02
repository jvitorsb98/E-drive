import { MapService } from './../../../../core/services/map/map.service';
import { GeocodingService } from './../../../../core/services/geocoding/geocoding.service';
import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormVehicleBatteryComponent } from '../modal-form-vehicle-battery/modal-form-vehicle-battery.component';
import { Step } from '../../../../core/models/step';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { DataAddressDetails } from '../../../../core/models/inter-Address';
import { LocationService } from '../../../../core/services/location/location.service';
import { ModalSelectAddressComponent } from '../modal-select-address/modal-select-address.component';

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
  isRouteActive = false; // Flag para verificar se a rota está ativa
  isAddressOpen = false;;
  isModalOpen = false; // Estado do modal principal
  isDetailsModalOpen = false; // Estado do modal de detalhes
  modalTitle = ''; // Título do modal principal
  modalDistance = ''; // Distância da estação ao usuário
  detailsModalTitle = ''; // Título do modal de detalhes
  detailsModalAddress: string | null = null; // Endereço da estação
  detailsModalPhone: string | null = null; // Telefone da estação
  detailsModalRating: string | null = null; // Avaliação da estação
  detailsModalOpenStatus: string | null = null; // Status de abertura da estação
  stepsArray: Array<Step> = [];
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  addressesWithCoordinates: { address: string; lat: number; lng: number }[] = []; // Array para armazenar endereços com coordenadas


  constructor(
    private cdr: ChangeDetectorRef,
    private tripPlannerMapsService: TripPlannerMapsService,
    private geocodingService: GeocodingService,
    private mapService: MapService,
    private locationService: LocationService,
    private dialog: MatDialog
  ) {
  }

  /**
 * Método chamado após a visualização do componente ser inicializada.
 * Carrega o script do Google Maps e inicializa o mapa.
 */
  async ngAfterViewInit() {
    try {
      await this.mapService.loadGoogleMapsScript();
      this.map = await this.mapService.initMap(this.mapContainer);
      this.userLocation = await this.locationService.getUserLocation();
      if (this.userLocation) {
        this.map.setCenter(this.userLocation);
      }
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer.setMap(this.map);
      this.map.addListener('idle', () => this.searchNearbyChargingStations());
    } catch (error) {
      console.error('Erro ao carregar o Google Maps', error);
    }

    /**
  * Método que gerencia o comportamento de arrasto do ícone de retorno à residência.
  * 
  * @description Este método adiciona ouvintes de eventos ao ícone de retorno à residência, 
  * permitindo que o usuário arraste o ícone em dispositivos móveis (iOS e Android) 
  * e em desktops. O comportamento de arrasto é ativado ao mover o ícone além de um 
  * limite mínimo de distância (threshold).
  *
  * @param {HTMLDivElement} icon - O elemento HTML que representa o ícone de retorno à residência.
  */
    const icon = document.getElementById('returnHomeIcon') as HTMLDivElement; // ID do ícone de retorno à residência

    let isDragging = false;
    let startX: number, startY: number;
    let offsetX: number, offsetY: number;

    // Detecta se é iOS ou Android para aplicar o tipo de evento adequado
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS || isAndroid) {
      // Eventos para iOS/Android (toque)
      icon.addEventListener('touchstart', (e: TouchEvent) => {
        isDragging = false;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const style = window.getComputedStyle(icon);
        offsetX = touch.clientX - parseInt(style.left, 10);
        offsetY = touch.clientY - parseInt(style.top, 10);
      });

      icon.addEventListener('touchmove', (e: TouchEvent) => {
        isDragging = true;
        const touch = e.touches[0];
        icon.style.left = (touch.clientX - offsetX) + 'px';
        icon.style.top = (touch.clientY - offsetY) + 'px';
        e.preventDefault();
      });

      icon.addEventListener('touchend', () => {
        isDragging = false; // Reset após o arrasto
      });
    } else {
      // Eventos para desktop (mouse)
      icon.addEventListener('mousedown', (e: MouseEvent) => {
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        const style = window.getComputedStyle(icon);
        offsetX = e.clientX - parseInt(style.left, 10);
        offsetY = e.clientY - parseInt(style.top, 10);
      });

      icon.addEventListener('mousemove', (e: MouseEvent) => {
        isDragging = true;
        icon.style.left = (e.clientX - offsetX) + 'px';
        icon.style.top = (e.clientY - offsetY) + 'px';
      });

      icon.addEventListener('mouseup', () => {
        isDragging = false; // Reset após o arrasto
      });
    }

    // Evento para clique direto no ícone (evita propagação do arrasto)
    icon.addEventListener('click', (e: Event) => {
      isDragging = false; // Reset após o clique
      e.stopPropagation(); // Impede que o clique inicie o arrasto
    });

  }

  cancelRoute() {
    this.directionsRenderer.setMap(null); // Remove a rota do mapa
    this.isRouteActive = false; // Desativa a rota
    this.isAddressOpen = false;
    this.stepsArray.splice(0, this.stepsArray.length);
    this.cdr.detectChanges(); // Força a verificação de mudanças
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
      if (this.isRouteActive) {
        return; // Não faz nada se a rota estiver ativa
      }
      this.currentPlace = place;
      this.showModal();
    });
  }

  openModalAddVehicleBattery() {
    this.closeModal(); // Fecha o modal atual
    const chargingStationDialogRef = this.dialog.open(ModalFormVehicleBatteryComponent, {
      width: '480px',
      height: '530px',
      data: {
        stepsArray: this.stepsArray, // Passando as informações de distância
        place: this.currentPlace, // Passando informações da estação atual, se necessário
        isStation: true
      },
    });

    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dados recebidos do modal:', result);
        // Inicie a rota no Google Maps
        const destination = this.currentPlace?.geometry?.location;
        this.isRouteActive = true;
        console.log('oi')
        // Configure o DirectionsRenderer para não exibir os marcadores padrão
        this.directionsRenderer.setOptions({
          suppressMarkers: true, // Suprime os marcadores padrão
          polylineOptions: {
            strokeColor: '#19B6DD', // Azul claro para a linha da rota
          },
        });


        // Verifique se o destino não é undefined antes de chamar initiateRoute
        if (destination) {
          this.initiateRoute(destination); // Passa apenas o local de destino
        } else {
          console.error('Localização do destino não disponível.');
        }
      } else {
        this.isModalOpen = true; // Abre o modal principal novamente
      }
    });

  }

  initiateRoute(destination: google.maps.LatLng) {
    if (!this.userLocation) {
      console.error('Localização do usuário não disponível.');
      return; // Retorne se a localização for nula
    }

    const request: google.maps.DirectionsRequest = {
      origin: this.userLocation, // Mantenha esta linha para usar a localização do usuário
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        this.directionsRenderer.setMap(this.map);
        this.isRouteActive = true; // Atualiza o estado da rota
        this.clearMarkers(); // Limpa os marcadores antes de adicionar novos
        this.searchNearbyChargingStations(); // Adiciona a busca após a rota
        this.cdr.detectChanges()
      } else {
        console.error('Erro ao iniciar a rota:', status);
      }
    });
  }
  /**
   * Exibe o modal com informações sobre a estação de carregamento.
   * @param place Informações sobre a estação de carregamento.
   */
  showModal() {
    if (!this.currentPlace) {
      console.warn('Nenhum lugar selecionado.');
      return;
    }

    this.modalTitle = this.currentPlace.name || 'Estação de carregamento';
    this.modalDistance = ''; // Resetar a distância, se necessário

    // Calcule a distância se a localização do usuário e o local estiverem disponíveis
    if (this.userLocation && this.currentPlace.geometry && this.currentPlace.geometry.location) {
      this.calculateRouteDistance(this.userLocation, this.currentPlace.geometry.location);
    }

    this.isModalOpen = true; // Defina a variável para abrir o modal
    this.openNow = this.currentPlace.opening_hours; // Defina a variável de abertura
    this.cdr.detectChanges(); // Força a verificação de mudanças
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
      this.detailsModalPhone = this.currentPlace.formatted_phone_number ? `Telefone : ${this.currentPlace.formatted_phone_number}` : null;
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
   * Calcula a distância entre a localização do usuário e a estação de carregamento.
   * @param origin Localização do usuário.
   * @param destination Localização da estação de carregamento.
   */

  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tripPlannerMapsService.calculateRouteDistance(startLocation, destination)
        .then(({ steps, totalDistance }) => {
          this.stepsArray = steps; // Atualiza o array de passos
          this.modalDistance = totalDistance; // Exibe a distância total
          this.cdr.detectChanges(); // Atualiza a exibição
          resolve(); // Resolve a promise ao final da execução
        })
        .catch(error => {
          this.modalDistance = "Erro ao calcular a distância.";
          console.error(error);
          this.cdr.detectChanges();
          reject(error); // Rejeita a promise em caso de erro
        });
    });
  }

  geocodeAddress(address: DataAddressDetails): Promise<{ address: string; lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      // Constrói o endereço a partir dos campos da interface DataAddressDetails
      const fullAddress = `${address.number} ${address.street}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;

      this.geocodingService.geocode(fullAddress).subscribe(
        (response) => {
          // Log detalhado da resposta

          if (response && response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            resolve({
              address: fullAddress,
              lat: location.lat,
              lng: location.lng
            });
          } else {
            // Caso não encontre resultados
            reject(`Geocoding failed for address: ${fullAddress}. No results found.`);
          }
        },
        (error) => {
          // Log detalhado do erro
          console.error(`Erro ao chamar o serviço de geocodificação para ${fullAddress}:`, error);
          reject(`Geocoding error for address ${fullAddress}: ${error.message || error}`);
        }
      );
    });
  }

  openSelectAddressModal() {
    this.isAddressOpen = true;
    const dialogRef = this.dialog.open(ModalSelectAddressComponent, {
      width: '480px',
      height: '320px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleAddressSelection(result);
      }
    });
  }

  private handleAddressSelection(address: DataAddressDetails) {
    console.log(address);
    this.geocodeAddress(address)
      .then(geocodedData => {
        this.setCurrentPlace(geocodedData);
        this.calculateDistanceToCurrentPlace();
      })
      .catch(error => {
        console.error('Erro ao geocodificar o endereço:', error);
      });
  }

  private setCurrentPlace(geocodedData: { address: string; lat: number; lng: number }) {
    this.currentPlace = {
      geometry: {
        location: new google.maps.LatLng(geocodedData.lat, geocodedData.lng),
      },
      name: geocodedData.address,
    };
  }

  private calculateDistanceToCurrentPlace() {
    if (this.userLocation && this.currentPlace!.geometry && this.currentPlace!.geometry.location) {
      this.calculateRouteDistance(this.userLocation, this.currentPlace!.geometry.location)
        .then(() => this.openVehicleBatteryModal())
        .catch(error => {
          console.error('Erro ao calcular a distância da rota:', error);
        });
    }
  }

  private openVehicleBatteryModal() {
    const chargingStationDialogRef = this.dialog.open(ModalFormVehicleBatteryComponent, {
      width: '480px',
      height: '530px',
      data: {
        stepsArray: this.stepsArray, // Passando as informações de distância
        place: this.currentPlace, // Passando informações da estação atual, se necessário
        isStation: true
      },
    });

    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleVehicleBatteryModalClose();
      }
    });
  }

  private handleVehicleBatteryModalClose() {
    const destination = this.currentPlace?.geometry?.location;
    this.isRouteActive = true;

    this.directionsRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#19B6DD',
      },
    });

    if (destination) {
      this.initiateRoute(destination);
    } else {
      console.error('Localização do destino não disponível.');
    }
  }

}
