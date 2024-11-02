import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';
import { MapService } from '../../../../core/services/map/map.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormVehicleBatteryComponent } from '../modal-form-vehicle-battery/modal-form-vehicle-battery.component';
import { Step } from '../../../../core/models/step';

/**
 * Componente para planejamento de viagens.
 * Este componente utiliza a API do Google Maps para fornecer funcionalidades de
 * mapeamento, geocodificação e planejamento de rotas.
 */
@Component({
  selector: 'app-planning-trip',
  templateUrl: './planning-trip.component.html',
  styleUrls: ['./planning-trip.component.scss']
})
export class PlanningTripComponent implements AfterViewInit {

  // Referências aos elementos do DOM
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef; // Contêiner do mapa
  @ViewChild('startLocationInput', { static: false }) startLocationInput!: ElementRef; // Input de localização inicial
  @ViewChild('endLocationInput', { static: false }) endLocationInput!: ElementRef; // Input de localização final

  // Variáveis para armazenar informações de localização
  startLocation: google.maps.LatLng | null = null; // Localização inicial
  endLocation: google.maps.LatLng | null = null; // Localização final
  currentPlace: google.maps.places.PlaceResult | null = null; // Localização atual
  isRouteActive: boolean = false; // Indica se a rota está ativa
  map!: google.maps.Map; // Instância do mapa
  markers: google.maps.Marker[] = []; // Array de marcadores no mapa
  directionsService!: google.maps.DirectionsService; // Serviço de direções do Google Maps
  directionsRenderer!: google.maps.DirectionsRenderer; // Renderizador de direções do Google Maps
  currentLocation: google.maps.LatLng | null = null; // Localização atual do usuário
  stepsArray: Step[] = []; // Array de etapas da rota
  totalDistance: number = 0; // Distância total da rota
  inputsVisible: boolean = false; // Controla a visibilidade dos inputs de localização

  private autocompleteStart!: google.maps.places.Autocomplete; // Autocomplete para a localização inicial
  private autocompleteEnd!: google.maps.places.Autocomplete; // Autocomplete para a localização final

  /**
   * Construtor do componente.
   * @param tripPlannerMapsService Serviço para planejamento de viagens.
   * @param mapService Serviço para manipulação do mapa.
   * @param cdr Detector de mudanças para atualização da UI.
   * @param dialog Diálogo para modais.
   */
  constructor(
    private tripPlannerMapsService: TripPlannerMapsService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  /**
   * Método chamado após a inicialização da visualização do componente.
   * Carrega o script do Google Maps e inicializa o mapa e serviços relacionados.
   */
  async ngAfterViewInit() {
    await this.mapService.loadGoogleMapsScript(); // Carrega o script da API do Google Maps
    this.map = await this.mapService.initMap(this.mapContainer); // Inicializa o mapa no contêiner especificado
    this.initDirectionsService(); // Inicializa o serviço de direções
    this.initAutocomplete(); // Inicializa o autocomplete para os inputs de localização

    /**
     * Método que gerencia o comportamento de arrasto do ícone de planejamento de viagem.
     * 
     * @description Este método adiciona ouvintes de eventos ao ícone de planejamento de viagem, 
     * permitindo que o usuário arraste o ícone em dispositivos móveis (iOS e Android) 
     * e em desktops. O comportamento de arrasto é ativado ao mover o ícone além de um 
     * limite mínimo de distância (threshold). 
     *
     * @param {HTMLDivElement} icon - O elemento HTML que representa o ícone de planejamento de viagem.
     */
    const travelPlanningIcon = document.getElementById('travelPlanningIcon') as HTMLDivElement;

    let isDragging = false;
    let offsetX: number, offsetY: number;

    // Função para gerenciar o arrasto do ícone
    const handleDrag = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
        travelPlanningIcon.style.left = (clientX - offsetX) + 'px';
        travelPlanningIcon.style.top = (clientY - offsetY) + 'px';
      }
    };

    // Detecta se é iOS ou Android para aplicar o tipo de evento adequado
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS || isAndroid) {
      // Eventos para iOS/Android (toque)
      travelPlanningIcon.addEventListener('touchstart', (e: TouchEvent) => {
        isDragging = true;
        const touch = e.touches[0];
        const style = window.getComputedStyle(travelPlanningIcon);
        offsetX = touch.clientX - parseInt(style.left, 10);
        offsetY = touch.clientY - parseInt(style.top, 10);
      });

      travelPlanningIcon.addEventListener('touchmove', handleDrag);

      travelPlanningIcon.addEventListener('touchend', () => {
        isDragging = false;
      });
    } else {
      // Eventos para desktop (mouse)
      travelPlanningIcon.addEventListener('mousedown', (e: MouseEvent) => {
        isDragging = true;
        const style = window.getComputedStyle(travelPlanningIcon);
        offsetX = e.clientX - parseInt(style.left, 10);
        offsetY = e.clientY - parseInt(style.top, 10);
      });

      travelPlanningIcon.addEventListener('mousemove', handleDrag);

      travelPlanningIcon.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    // Previne o comportamento de arrasto do ícone ao clicar
    travelPlanningIcon.addEventListener('click', (e: Event) => {
      e.stopPropagation(); // Impede a propagação do evento de clique
    });

  }

  /**
   * Inicializa o serviço de direções e configura o renderizador.
   */
  private initDirectionsService() {
    this.directionsRenderer = new google.maps.DirectionsRenderer(); // Cria uma nova instância do renderizador de direções
    this.directionsService = new google.maps.DirectionsService(); // Cria uma nova instância do serviço de direções
    this.directionsRenderer.setMap(this.map); // Define o mapa onde as direções serão renderizadas
  }

  /**
   * Inicializa os campos de autocomplete para as localizações inicial e final.
   */
  async initAutocomplete() {

    const startInput = this.startLocationInput.nativeElement; // Obtém o elemento DOM do input inicial
    const endInput = this.endLocationInput.nativeElement; // Obtém o elemento DOM do input final

    const options = {
      componentRestrictions: { country: 'br' } // Restrições para autocomplete (apenas Brasil)
    };

    this.autocompleteStart = new google.maps.places.Autocomplete(startInput, options); // Inicializa o autocomplete para o input inicial
    this.autocompleteEnd = new google.maps.places.Autocomplete(endInput, options); // Inicializa o autocomplete para o input final

    this.autocompleteStart.addListener('place_changed', () => {
      const place = this.autocompleteStart.getPlace();
      this.startLocation = place.geometry?.location || null; // Atualiza a localização inicial com o lugar selecionado no autocomplete
    });

    this.autocompleteEnd.addListener('place_changed', () => {
      const place = this.autocompleteEnd.getPlace();
      this.endLocation = place.geometry?.location || null; // Atualiza a localização final com o lugar selecionado no autocomplete
    });
  }

  /**
   * Reseta os campos de entrada do autocomplete e reinicializa o autocomplete.
   */
  resetAutocomplete() {
    // Limpa os valores das localizações inicial e final
    this.startLocation = null;
    this.endLocation = null;

    // Se você tiver referências aos inputs, limpe seus valores
    if (this.startLocationInput && this.startLocationInput.nativeElement) {
      this.startLocationInput.nativeElement.value = '';
    }

    if (this.endLocationInput && this.endLocationInput.nativeElement) {
      this.endLocationInput.nativeElement.value = '';
    }

    // // Reinicializa o autocomplete para ambos os campos
    this.initAutocomplete();
  }

  /**
   * Planeja a viagem com base nas localizações selecionadas pelo usuário.
   */
  async planTrip() {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (!this.startLocation || !this.endLocation) {
      console.error('Por favor, selecione os locais de início e destino.');
      return;
    }

    this.map.setCenter(this.startLocation);
    this.inputsVisible = false;

    try {
      await this.calculateRouteDistance(this.startLocation, this.endLocation);
      this.setCurrentPlace({
        address: this.endLocation?.toString() || '',
        lat: this.endLocation?.lat() || 0,
        lng: this.endLocation?.lng() || 0
      });
      this.openModalAddVehicleBattery();
    } catch (error) {
      console.error('Erro ao calcular a distância:', error);
    }

  }

  /**
   * Abre um modal para adicionar informações sobre a bateria do veículo.
   */
  private openModalAddVehicleBattery() {
    const chargingStationDialogRef = this.dialog.open(ModalFormVehicleBatteryComponent, {
      width: '480px',
      height: '530px',
      data: {
        stepsArray: this.stepsArray,
        place: this.startLocation,
        isStation: false
      },
    });

    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleVehicleBatteryModalClose(result.chargingStations);
      }
    });
  }

  /**
   * Lida com o fechamento do modal e adiciona marcadores das estações de carregamento no mapa.
   * @param chargingStations Lista das estações de carregamento selecionadas pelo usuário.
   */
  private handleVehicleBatteryModalClose(chargingStations: any) {
    const destination = this.currentPlace?.geometry?.location;

    this.directionsRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#19B6DD',
      },
    });

    if (destination) {
      this.initiateRoute(destination);
      this.addChargingStationMarkers(chargingStations);
    } else {
      console.error('Localização do destino não disponível.');
    }
  }

  /**
   * Adiciona marcadores das estações de carregamento no mapa.
   * @param chargingStations Lista das estações de carregamento a serem adicionadas como marcadores.
   */
  private addChargingStationMarkers(chargingStations: any) {
    console.log("OLA", chargingStations);

    try {
      chargingStations.forEach((station: any) => {
        if (station.geometry && station.geometry.location) {
          const position = new google.maps.LatLng(
            station.geometry.location.lat(),
            station.geometry.location.lng()
          );

          const marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: 'Estação de Carregamento',
            icon: {
              url: "../../../../assets/images/station_open.svg",
              scaledSize: new google.maps.Size(30, 30)
            }
          });
          this.markers.push(marker);
        } else {
          console.error('Estação de carregamento inválida:', station);
        }
      });

    } catch (error) {
      console.error('Erro ao adicionar marcadores de estações de carregamento:', error);
    }
  }

  /**
    * Inicia a rota entre a localização inicial e o destino selecionado.
    * @param destination Localização final da rota.
    */
  private initiateRoute(destination: google.maps.LatLng) {

    if (!this.startLocation) {
      console.error('Localização do usuário não disponível.');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: this.startLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        this.directionsRenderer.setMap(this.map);
        this.isRouteActive = true;
      } else {
        console.error('Erro ao iniciar a rota:', status);
      }
    });
  }

  /**
    * Define a localização atual com base nos dados geocodificados recebidos.
    * @param geocodedData Dados geocodificados contendo endereço e coordenadas.
    */
  private setCurrentPlace(geocodedData: { address: string; lat: number; lng: number }) {
    this.currentPlace = {
      geometry: {
        location: new google.maps.LatLng(geocodedData.lat, geocodedData.lng),
      },
      name: geocodedData.address,
    };
  }

  /**
    * Calcula a distância da rota entre duas localizações usando um serviço externo.
    * @param startLocation Localização inicial da rota.
    * @param destination Localização final da rota.
    * @returns Promise que resolve quando a distância é calculada com sucesso ou rejeita em caso de erro.
    */
  private calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tripPlannerMapsService.calculateRouteDistance(startLocation, destination)
        .then(({ steps, totalDistance }) => {
          this.stepsArray = steps;
          this.totalDistance = Number(totalDistance);
          resolve();
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }

  /**
    * Cancela a rota atual e limpa os marcadores no mapa.
    */
  cancelRoute() {
    // Desativa o renderizador de direções
    this.directionsRenderer.setMap(null);
    this.isRouteActive = false;
    this.cdr.detectChanges();

    // Reseta os campos de autocomplete
    this.resetAutocomplete();


    // Limpa o array de passos
    this.stepsArray.splice(0, this.stepsArray.length);

    // Limpa os marcadores no mapa
    this.clearMarkers();

    // Detecta mudanças no estado do componente
  }

  /**
    * Limpa todos os marcadores do mapa.
    */
  private clearMarkers(): void {
    for (let marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  /**
  * @description Alterna a visibilidade dos campos de entrada para a localização inicial e final,
  * exibindo ou ocultando-os ao inverter o valor de `showInputs`.
  * 
  * @returns void
  */
  toggleInputs() {
    this.inputsVisible = !this.inputsVisible;

    // Limpa os campos de entrada quando os inputs são ocultados
    if (this.inputsVisible) {
      this.startLocation = null;
      this.endLocation = null;
      this.startLocationInput.nativeElement.value = '';
      this.endLocationInput.nativeElement.value = '';
    }
  }

}
