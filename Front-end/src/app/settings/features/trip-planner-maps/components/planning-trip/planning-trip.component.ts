// Importa os módulos principais do Angular
import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

// Importa o serviço de planejamento de viagem que contém a lógica para calcular rotas e distâncias
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';

// Importa o serviço de mapa, responsável por carregar e inicializar o mapa do Google
import { MapService } from '../../../../core/services/map/map.service';

// Importa o módulo de diálogo do Angular Material para criar modais
import { MatDialog } from '@angular/material/dialog';

// Importa o componente do modal para adicionar informações sobre a bateria do veículo
import { ModalFormVehicleBatteryComponent } from '../modal-form-vehicle-battery/modal-form-vehicle-battery.component';

// Importa a interface Step que representa uma etapa na rota
import { Step } from '../../../../core/models/step';
import { RouteService } from '../../../../core/services/trip-planner-maps/route/route.service';

/**
 * @description Componente responsável pela funcionalidade de planejamento de viagem,
 * incluindo a visualização do mapa, o autocomplete de localizações e a interação com
 * estações de carregamento.
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
    private routeService: RouteService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  /**
  * @description Método chamado após a inicialização da visualização do componente.
  * Carrega o script do Google Maps e inicializa o mapa e serviços relacionados.
  */
  async ngAfterViewInit() {
    await this.mapService.loadGoogleMapsScript(); // Carrega o script da API do Google Maps
    this.map = await this.mapService.initMap(this.mapContainer); // Inicializa o mapa no contêiner especificado
    this.initDirectionsService(); // Inicializa o serviço de direções
    this.initAutocomplete(); // Inicializa o autocomplete para os inputs de localização
  }

  /**
   * @description Inicializa o serviço de direções e configura o renderizador.
   * Cria instâncias do renderizador e do serviço de direções e associa o renderizador ao mapa.
   */
  private initDirectionsService() {
    this.directionsRenderer = new google.maps.DirectionsRenderer(); // Cria uma nova instância do renderizador de direções
    this.directionsService = new google.maps.DirectionsService(); // Cria uma nova instância do serviço de direções
    this.directionsRenderer.setMap(this.map); // Define o mapa onde as direções serão renderizadas
  }

  /**
   * @description Inicializa os campos de autocomplete para as localizações inicial e final.
   * Adiciona ouvintes de eventos para atualizar as localizações ao selecionar um lugar.
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
 * @description Reseta os campos de entrada do autocomplete e reinicializa o autocomplete.
 * Limpa os valores das localizações inicial e final, e reinicializa os campos de autocomplete.
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

    // Reinicializa o autocomplete para ambos os campos
    this.initAutocomplete();
  }

  /**
   * @description Planeja a viagem com base nas localizações selecionadas pelo usuário.
   * @async
   * @returns {Promise<void>} Retorna uma Promise que é resolvida após o planejamento da viagem.
   */
  async planTrip() {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simula um atraso de 200ms

    if (!this.startLocation || !this.endLocation) {
      console.error('Por favor, selecione os locais de início e destino.');
      return;
    }

    this.map.setCenter(this.startLocation); // Centraliza o mapa na localização inicial
    this.inputsVisible = false; // Oculta os inputs de localização

    try {
      await this.calculateRouteDistance(this.startLocation, this.endLocation); // Calcula a distância da rota
      this.setCurrentPlace({
        address: this.endLocation?.toString() || '', // Define o endereço do local final
        lat: this.endLocation?.lat() || 0, // Define a latitude do local final
        lng: this.endLocation?.lng() || 0  // Define a longitude do local final
      });
      this.openModalAddVehicleBattery(); // Abre o modal para adicionar a bateria do veículo
    } catch (error) {
      console.error('Erro ao calcular a distância:', error); // Loga o erro se ocorrer
    }
  }

  /**
  * @description Abre um modal para adicionar informações sobre a bateria do veículo.
  * Este modal permite que o usuário insira dados relacionados à bateria em uma estação de carregamento.
  */
  private openModalAddVehicleBattery() {
    const chargingStationDialogRef = this.dialog.open(ModalFormVehicleBatteryComponent, {
      width: '480px', // Largura do modal
      height: '530px', // Altura do modal
      data: {
        stepsArray: this.stepsArray, // Passa o array de etapas para o modal
        place: this.startLocation, // Passa a localização inicial para o modal
        isStation: false // Indica que não é uma estação de carregamento
      },
    });

    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleVehicleBatteryModalClose(result.chargingStations); // Chama o método para lidar com o fechamento do modal
      }
    });
  }

  /**
   * @description Lida com o fechamento do modal e adiciona marcadores das estações de carregamento no mapa.
   * @param {any} chargingStations - Lista das estações de carregamento selecionadas pelo usuário.
   * @returns {void}
   */
  private handleVehicleBatteryModalClose(chargingStations: any) {
    const destination = this.currentPlace?.geometry?.location; // Obtém a localização do destino atual

    this.directionsRenderer.setOptions({
      suppressMarkers: true, // Suprime marcadores padrão
      polylineOptions: {
        strokeColor: '#19B6DD', // Define a cor da polilinha
      },
    });

    if (destination) {
      this.initiateRoute(destination); // Inicia a rota com o destino
      this.addChargingStationMarkers(chargingStations); // Adiciona marcadores para as estações de carregamento
    } else {
      console.error('Localização do destino não disponível.'); // Loga um erro se a localização do destino não estiver disponível
    }
  }

  /**
  * @description Adiciona marcadores das estações de carregamento no mapa.
  * @param {any[]} chargingStations - Lista das estações de carregamento a serem adicionadas como marcadores.
  * Cada estação deve conter dados geocodificados com uma propriedade 'geometry' que inclui 'location'.
  * @returns {void}
  */
  private addChargingStationMarkers(chargingStations: any[]) {

    try {
      chargingStations.forEach((station: any) => {
        // Verifica se a estação contém a geometria e a localização
        if (station.geometry && station.geometry.location) {
          const position = new google.maps.LatLng(
            station.geometry.location.lat(),
            station.geometry.location.lng()
          );

          // Cria um marcador para a estação de carregamento
          const marker = new google.maps.Marker({
            position: position,
            map: this.map, // Mapa onde o marcador será exibido
            title: 'Estação de Carregamento', // Título exibido ao passar o mouse sobre o marcador
            icon: {
              url: "../../../../e-drive/assets/images/station_open.svg", // Caminho para o ícone da estação
              scaledSize: new google.maps.Size(30, 30) // Tamanho escalado do ícone
            }
          });
          this.markers.push(marker); // Adiciona o marcador ao array de marcadores
        } else {
          console.error('Estação de carregamento inválida:', station); // Loga erro se a estação não for válida
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar marcadores de estações de carregamento:', error); // Loga erro no bloco catch
    }
  }

  /**
   * @description Inicia a rota entre a localização inicial e o destino selecionado.
   * @param {google.maps.LatLng} destination - Localização final da rota.
   * @returns {void}
   */
  private initiateRoute(destination: google.maps.LatLng) {
    if (!this.startLocation) {
      console.error('Localização do usuário não disponível.');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: this.startLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING, // Define o modo de viagem como direção
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result); // Define as direções no renderizador
        this.directionsRenderer.setMap(this.map); // Exibe o mapa com as direções
        this.isRouteActive = true; // Indica que a rota está ativa
      } else {
        console.error('Erro ao iniciar a rota:', status); // Loga um erro se a rota não puder ser iniciada
      }
    });
  }

  /**
   * @description Define a localização atual com base nos dados geocodificados recebidos.
   * @param {Object} geocodedData - Dados geocodificados contendo endereço e coordenadas.
   * @param {string} geocodedData.address - Endereço geocodificado.
   * @param {number} geocodedData.lat - Latitude da localização geocodificada.
   * @param {number} geocodedData.lng - Longitude da localização geocodificada.
   * @returns {void}
   */
  private setCurrentPlace(geocodedData: { address: string; lat: number; lng: number }) {
    this.currentPlace = {
      geometry: {
        location: new google.maps.LatLng(geocodedData.lat, geocodedData.lng),
      },
      name: geocodedData.address, // Define o nome do lugar
    };
  }

  /**
   * @description Calcula a distância da rota entre duas localizações usando um serviço externo.
   * @param {google.maps.LatLng} startLocation - Localização inicial da rota.
   * @param {google.maps.LatLng} destination - Localização final da rota.
   * @returns {Promise<void>} Promise que resolve quando a distância é calculada com sucesso ou rejeita em caso de erro.
   */
  private calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<void> {
    return new Promise((resolve, reject) => {
      this.routeService.calculateRouteDistance(startLocation, destination)
        .then(({ steps, totalDistance }) => {
          this.stepsArray = steps; // Armazena os passos da rota
          this.totalDistance = Number(totalDistance); // Armazena a distância total
          resolve(); // Resolve a promise
        })
        .catch(error => {
          console.error(error); // Loga um erro se a distância não puder ser calculada
          reject(error); // Rejeita a promise
        });
    });
  }

  /**
   * @description Cancela a rota atual e limpa os marcadores no mapa.
   * @returns {void}
   */
  cancelRoute() {
    this.directionsRenderer.setMap(null); // Desativa o renderizador de direções
    this.isRouteActive = false; // Define que a rota não está mais ativa
    this.cdr.detectChanges(); // Detecta mudanças no estado do componente

    this.resetAutocomplete(); // Reseta os campos de autocomplete

    this.stepsArray.splice(0, this.stepsArray.length); // Limpa o array de passos

    this.clearMarkers(); // Limpa os marcadores no mapa
  }

  /**
   * @description Limpa todos os marcadores do mapa.
   * @returns {void}
   */
  private clearMarkers(): void {
    for (let marker of this.markers) {
      marker.setMap(null); // Remove o marcador do mapa
    }
    this.markers = []; // Limpa o array de marcadores
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
