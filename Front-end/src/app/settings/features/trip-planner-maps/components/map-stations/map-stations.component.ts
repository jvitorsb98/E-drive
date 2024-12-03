// Importa o serviço de mapa, responsável por carregar e manipular o mapa
import { MapService } from './../../../../core/services/map/map.service';

// Importa o serviço de geocodificação, utilizado para converter endereços em coordenadas
import { GeocodingService } from './../../../../core/services/apis/geocoding/geocoding.service';

// Importa os módulos principais do Angular, incluindo componentes e referências de elemento
import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

// Importa o módulo de diálogo do Angular Material para criar modais
import { MatDialog } from '@angular/material/dialog';

// Importa o componente do modal para adicionar informações sobre a bateria do veículo
import { ModalFormVehicleBatteryComponent } from '../modal-form-vehicle-battery/modal-form-vehicle-battery.component';

// Importa a interface Step que representa uma etapa na rota
import { Step } from '../../../../core/models/step';

// Importa o serviço de planejamento de viagem que contém a lógica para calcular rotas e distâncias
import { TripPlannerMapsService } from '../../../../core/services/trip-planner-maps/trip-planner-maps.service';

// Importa a interface para detalhes de endereço utilizados nas interações
import { DataAddressDetails } from '../../../../core/models/inter-Address';

// Importa o serviço de localização, que pode conter lógica para gerenciar a localização do usuário
import { LocationService } from '../../../../core/services/apis/location/location.service';

// Importa o componente do modal para seleção de endereços
import { ModalSelectAddressComponent } from '../modal-select-address/modal-select-address.component';
import { RouteService } from '../../../../core/services/trip-planner-maps/route/route.service';

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
  isAddressOpen = false;
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
    private routeService: RouteService,
    private locationService: LocationService,
    private dialog: MatDialog
  ) {
  }

  /**
   * @description
   * Método do ciclo de vida que é chamado após a inicialização da view do componente.
   * Carrega o script do Google Maps, inicializa o mapa na posição do usuário,
   * configura os serviços de direções e adiciona um listener para buscar
   * estações de carregamento nas proximidades.
   *
   * @param {void} Não recebe parâmetros.
   */
  async ngAfterViewInit() {
    try {
      // Carrega o script do Google Maps usando o serviço de mapa
      await this.mapService.loadGoogleMapsScript();

      // Inicializa o mapa e obtém a referência para ele
      this.map = await this.mapService.initMap(this.mapContainer);

      // Obtém a localização do usuário
      this.userLocation = await this.locationService.getUserLocation();

      // Se a localização do usuário for encontrada, centraliza o mapa nessa localização
      if (this.userLocation) {
        this.map.setCenter(this.userLocation);
      }

      // Cria uma nova instância do DirectionsRenderer para exibir direções no mapa
      this.directionsRenderer = new google.maps.DirectionsRenderer();

      // Cria uma nova instância do DirectionsService para calcular rotas
      this.directionsService = new google.maps.DirectionsService();

      // Associa o DirectionsRenderer ao mapa para exibir as direções
      this.directionsRenderer.setMap(this.map);

      // Adiciona um listener para o evento 'idle' do mapa, que será acionado quando
      // o mapa estiver parado após uma interação (como zoom ou pan)
      this.map.addListener('idle', () => this.searchNearbyChargingStations());
    } catch (error) {
      // Captura e exibe qualquer erro que ocorra durante o carregamento do Google Maps
      console.error('Erro ao carregar o Google Maps', error);
    }
  }

  /**
 * @description
 * Cancela a rota atual removendo-a do mapa e limpando os dados relacionados.
 * Desativa a rota, fecha o painel de endereços e reseta o array de passos.
 *
 * @param {void} Não recebe parâmetros.
 */
  cancelRoute() {
    this.directionsRenderer.setMap(null); // Remove a rota do mapa
    this.isRouteActive = false; // Desativa a rota
    this.isAddressOpen = false; // Fecha o painel de endereços
    this.stepsArray.splice(0, this.stepsArray.length); // Limpa o array de passos
    this.cdr.detectChanges(); // Força a verificação de mudanças
  }

  /**
   * @description
   * Busca estações de carregamento próximas à localização atual do mapa.
   *
   * @param {void} Não recebe parâmetros.
   */
  searchNearbyChargingStations() {
    const service = new google.maps.places.PlacesService(this.map); // Cria uma instância do serviço de Places
    this.performTextSearch(service); // Executa a busca de texto para estações de carregamento
  }

  /**
   * @description
   * Realiza uma busca de texto para encontrar estações de carregamento elétrico
   * nas proximidades da localização atual do mapa.
   *
   * @param {google.maps.places.PlacesService} service - Serviço de Places do Google Maps
   * que permite realizar buscas de lugares.
   *
   * @param {void} Não recebe parâmetros.
   */
  performTextSearch(service: google.maps.places.PlacesService) {
    const location = this.map.getCenter(); // Obtém a localização central do mapa
    const query = 'estação de carregamento elétrico'; // Define a consulta de busca
    const radius = 30000; // Define o raio da busca em metros

    // Realiza a busca de texto com a consulta e a localização
    service.textSearch({
      query: query,
      location: location,
      radius: radius
    }, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        this.clearMarkers(); // Limpa marcadores existentes no mapa
        results.forEach(place => {
          this.createMarkerForChargingStation(place); // Cria um marcador para cada estação de carregamento encontrada
        });
      } else {
        console.error('Erro ao buscar estações de carregamento:', status); // Loga o erro em caso de falha na busca
      }
    });
  }

  /**
  * @description
  * Remove todos os marcadores do mapa.
  *
  * @param {void} Não recebe parâmetros.
  */
  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null); // Remove cada marcador do mapa
    });
    this.markers = []; // Reseta a lista de marcadores
  }

  /**
   * @description
   * Cria um marcador para uma estação de carregamento e adiciona ao mapa.
   * O marcador é configurado com um ícone que indica se a estação está aberta ou fechada.
   *
   * @param {google.maps.places.PlaceResult} place - Informações sobre a estação de carregamento,
   * incluindo sua geometria e dados relevantes.
   *
   * @param {void} Não recebe parâmetros.
   */
  createMarkerForChargingStation(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) {
      console.warn('Place geometry or location is undefined:', place); // Loga um aviso se a geometria ou localização não estiver definida
      return; // Retorna se não houver geometria ou localização
    }

    // Define o URL do ícone com base nos horários de funcionamento da estação
    const iconUrl = place.opening_hours ? "../../../../e-drive/assets/images/station_open.svg" : "../../../../e-drive/assets/images/station_closed.svg";

    // Cria um novo marcador para a estação de carregamento
    const marker = new google.maps.Marker({
      map: this.map, // Mapa onde o marcador será adicionado
      position: place.geometry.location, // Posição do marcador
      title: place.name || '', // Título do marcador (nome da estação)
      icon: {
        url: iconUrl, // URL do ícone do marcador
        scaledSize: new google.maps.Size(30, 30) // Tamanho do ícone
      }
    });

    this.markers.push(marker); // Adiciona o marcador ao array de marcadores

    // Adiciona um ouvinte de evento para o clique no marcador
    marker.addListener('click', () => {
      if (this.isRouteActive) {
        return; // Não faz nada se a rota estiver ativa
      }
      this.currentPlace = place; // Define a estação atual como a estação clicada
      this.showModal(); // Exibe o modal com informações da estação
    });
  }

  /**
  * @description
  * Abre um modal para adicionar informações da bateria do veículo. 
  * Fecha o modal atual e passa dados relevantes para o novo modal. 
  * Após o fechamento do modal, inicia a rota para a estação de carregamento selecionada.
  */
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

    // Após o fechamento do modal, processa o resultado
    chargingStationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dados recebidos do modal:', result);
        // Inicie a rota no Google Maps
        const destination = this.currentPlace?.geometry?.location;
        this.isRouteActive = true;
        console.log('oi');
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
        this.isModalOpen = true; // Abre o modal principal novamente se não houver resultado
      }
    });
  }

  /**
   * @description
   * Inicia a rota do usuário até o destino fornecido. 
   * Se a localização do usuário estiver disponível, faz uma requisição de direções ao Google Maps.
   *
   * @param {google.maps.LatLng} destination - A localização de destino para a rota.
   */
  initiateRoute(destination: google.maps.LatLng) {
    if (!this.userLocation) {
      console.error('Localização do usuário não disponível.'); // Loga um erro se a localização do usuário não estiver disponível
      return; // Retorne se a localização for nula
    }

    // Cria o pedido de direções com a origem e o destino
    const request: google.maps.DirectionsRequest = {
      origin: this.userLocation, // Mantenha esta linha para usar a localização do usuário
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    // Solicita direções ao Google Maps
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result); // Define as direções no renderizador
        this.directionsRenderer.setMap(this.map); // Define o mapa no renderizador
        this.isRouteActive = true; // Atualiza o estado da rota
        this.clearMarkers(); // Limpa os marcadores antes de adicionar novos
        this.searchNearbyChargingStations(); // Adiciona a busca após a rota
        this.cdr.detectChanges(); // Força a verificação de mudanças no Angular
      } else {
        console.error('Erro ao iniciar a rota:', status); // Loga um erro se a requisição falhar
      }
    });
  }

  /**
 * @description
 * Exibe o modal com informações sobre a estação de carregamento.
 * Se a localização do usuário e a localização da estação estiverem disponíveis,
 * calcula a distância até a estação e exibe o título no modal.
 *
 * @param {google.maps.places.PlaceResult} place - Informações sobre a estação de carregamento.
 */
  showModal() {
    if (!this.currentPlace) {
      console.warn('Nenhum lugar selecionado.'); // Loga um aviso se nenhum lugar estiver selecionado
      return; // Retorna se não houver lugar selecionado
    }

    this.modalTitle = this.currentPlace.name || 'Estação de carregamento'; // Define o título do modal
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
   * @description
   * Fecha o modal principal.
   */
  closeModal() {
    this.isModalOpen = false; // Defina a variável para fechar o modal
    this.cdr.detectChanges(); // Força a verificação de mudanças
  }

  /**
  * @description
  * Exibe o modal de detalhes com informações adicionais sobre a estação de carregamento.
  * Se a `currentPlace` estiver disponível, define o título do modal, 
  * o endereço, telefone, avaliação e status de abertura da estação.
  */
  showDetailsModal() {
    if (this.currentPlace) {
      this.detailsModalTitle = this.currentPlace.name || 'Detalhes do Posto'; // Define o título do modal
      this.detailsModalAddress = this.currentPlace.vicinity ? `Endereço : ${this.currentPlace.vicinity}` : null; // Define o endereço, se disponível
      this.detailsModalPhone = this.currentPlace.formatted_phone_number ? `Telefone : ${this.currentPlace.formatted_phone_number}` : null; // Define o telefone, se disponível
      this.detailsModalRating = this.currentPlace.rating ? `Avaliação : ${this.currentPlace.rating} estrelas` : null; // Define a avaliação, se disponível
      this.detailsModalOpenStatus = this.currentPlace.opening_hours ? "Aberto agora" : "Fechado agora"; // Define o status de abertura

      this.isDetailsModalOpen = true; // Abre o modal de detalhes
      this.cdr.detectChanges(); // Força a verificação de mudanças
    } else {
      console.warn('currentPlace is null, cannot show details.'); // Loga um aviso se não houver um lugar atual
    }
  }

  /**
   * @description
   * Fecha o modal de detalhes.
   */
  closeDetailsModal() {
    this.isDetailsModalOpen = false; // Feche o modal de detalhes
    this.cdr.detectChanges(); // Força a verificação de mudanças
  }

  /**
 * @description
 * Calcula a distância entre a localização do usuário e a estação de carregamento.
 * @param startLocation - Localização do usuário, representada como um objeto google.maps.LatLng.
 * @param destination - Localização da estação de carregamento, representada como um objeto google.maps.LatLng.
 * @returns Promise<void> - Uma promessa que resolve quando a distância é calculada com sucesso, ou rejeita em caso de erro.
 */
  calculateRouteDistance(startLocation: google.maps.LatLng, destination: google.maps.LatLng): Promise<void> {
    return new Promise((resolve, reject) => {
      this.routeService.calculateRouteDistance(startLocation, destination)
        .then(({ steps, totalDistance }) => {
          this.stepsArray = steps; // Atualiza o array de passos
          this.modalDistance = totalDistance; // Exibe a distância total
          this.cdr.detectChanges(); // Atualiza a exibição
          resolve(); // Resolve a promise ao final da execução
        })
        .catch(error => {
          this.modalDistance = "Erro ao calcular a distância."; // Mensagem de erro
          console.error(error);
          this.cdr.detectChanges();
          reject(error); // Rejeita a promise em caso de erro
        });
    });
  }

  /**
   * @description
   * Geocodifica um endereço fornecido na forma de um objeto DataAddressDetails, 
   * retornando as coordenadas geográficas correspondentes.
   * @param address - Objeto contendo os detalhes do endereço a ser geocodificado.
   * @returns Promise<{ address: string; lat: number; lng: number }> - Uma promessa que resolve com o endereço completo e suas coordenadas, ou rejeita em caso de erro.
   */
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

  /**
  * @description
  * Abre um modal para seleção de endereço e espera a confirmação do usuário.
  */
  openSelectAddressModal() {
    const dialogRef = this.dialog.open(ModalSelectAddressComponent, {
      width: '500px',
      height: '365px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleAddressSelection(result);
      }
    });
  }

  /**
   * @description
   * Trata a seleção de um endereço, geocodificando-o e atualizando o local atual.
   * @param address - Detalhes do endereço selecionado pelo usuário, conforme a interface DataAddressDetails.
   */
  private handleAddressSelection(address: DataAddressDetails) {
    console.log(address);
    this.geocodeAddress(address)
      .then(geocodedData => {
        this.setCurrentPlace(geocodedData);
        this.calculateDistanceToCurrentPlace(); // Chama o método para calcular a distância até o local atual
      })
      .catch(error => {
        console.error('Erro ao geocodificar o endereço:', error);
      });
  }

  /**
   * @description
   * Atualiza o local atual com os dados geocodificados, criando um objeto 
   * com a geometria e o nome do lugar.
   * @param geocodedData - Dados geocodificados contendo o endereço, latitude e longitude.
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
 * @description
 * Calcula a distância até o local atual, se a localização do usuário e as 
 * informações do local atual estiverem disponíveis. 
 * Em caso de sucesso, abre o modal de informações da bateria do veículo.
 */
  private calculateDistanceToCurrentPlace() {
    if (this.userLocation && this.currentPlace!.geometry && this.currentPlace!.geometry.location) {
      this.calculateRouteDistance(this.userLocation, this.currentPlace!.geometry.location)
        .then(() => this.openVehicleBatteryModal()) // Chama o método para abrir o modal após calcular a distância
        .catch(error => {
          console.error('Erro ao calcular a distância da rota:', error);
        });
    }
  }

  /**
   * @description
   * Abre o modal para informações sobre a bateria do veículo, passando dados
   * relevantes sobre a estação de carregamento e os passos da rota.
   */
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
        this.handleVehicleBatteryModalClose(); // Chama o método para tratar o fechamento do modal
      }
    });
  }

  /**
 * @description
 * Trata o fechamento do modal de informações sobre a bateria do veículo.
 * Inicia a rota em direção à estação de carregamento selecionada,
 * configurando as opções do DirectionsRenderer para personalizar a exibição da rota.
 */
  private handleVehicleBatteryModalClose() {
    const destination = this.currentPlace?.geometry?.location; // Obtém a localização do destino
    this.isRouteActive = true; // Define que a rota está ativa

    this.directionsRenderer.setOptions({
      suppressMarkers: true, // Suprime os marcadores padrão do DirectionsRenderer
      polylineOptions: {
        strokeColor: '#19B6DD', // Define a cor da linha da rota
      },
    });

    if (destination) {
      this.initiateRoute(destination); // Inicia a rota se o destino estiver disponível
    } else {
      console.error('Localização do destino não disponível.'); // Log de erro se o destino não estiver disponível
    }
  }
}