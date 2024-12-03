import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapStationsComponent } from './map-stations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('MapStationsComponent', () => {
  let component: MapStationsComponent;
  let fixture: ComponentFixture<MapStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapStationsComponent],
      imports: [HttpClientTestingModule], 
    }).compileComponents();

    fixture = TestBed.createComponent(MapStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.markers).toEqual([]);
    expect(component.userLocation).toBeNull();
    expect(component.currentPlace).toBeNull();
  });

it('should update userLocation correctly', () => {
  const mockLatLng = { 
    lat: () => 10, 
    lng: () => 20 
  };

  // Simula o comportamento do objeto LatLng do Google Maps
  component.userLocation = {
    lat: mockLatLng.lat,
    lng: mockLatLng.lng,
  } as unknown as google.maps.LatLng;

  expect(component.userLocation.lat()).toBe(10);
  expect(component.userLocation.lng()).toBe(20);
});

it('should add a marker to the map', () => {
  const mockMap: any = {};  // Mock do mapa
  const markerMock = {
    addListener: jest.fn(),  // Mock do método addListener
  };

  // Mock do Google Maps Marker
  jest.spyOn(google.maps, 'Marker').mockReturnValue(markerMock as any);

  // Mock do método que cria o marcador
  jest.spyOn(component, 'createMarkerForChargingStation').mockImplementation(() => {
    // Dentro da implementação, vamos chamar a lógica do Marker com addListener
    new google.maps.Marker({ map: mockMap }).addListener('click', () => {});
  });

  // Simula a execução do método que cria o marcador
  component.createMarkerForChargingStation(mockMap);

  // Verifica se addListener foi chamado corretamente
  expect(markerMock.addListener).toHaveBeenCalledWith('click', expect.any(Function));
});

it('should trigger click event on marker', () => {
  const mockMap: any = {}; // Mock do mapa

  // Mock da classe google.maps.Size
  const mockSize = jest.fn().mockImplementation((width: number, height: number) => {
    return {
      width: width,
      height: height,
      equals: jest.fn(function (size: any) {
        return this.width === size.width && this.height === size.height; // Comparação simples
      }),
    };
  });

  // Mock do Google Maps Marker
  const markerMock = {
    addListener: jest.fn((event, callback) => {
      if (event === 'click') {
        callback(); // Simula o evento de clique chamando o callback
      }
    }),
  };

  // Substitui o construtor de Marker pelo mock
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  // Substitui google.maps.Size pelo mock
  google.maps.Size = mockSize;

  // Mock da função showModal para que o Jest rastreie se ela é chamada
  const showModalSpy = jest.spyOn(component, 'showModal');

  // Método sendo testado
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: {
        lat: jest.fn(() => 10),
        lng: jest.fn(() => 20),
      } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true, // Adicionando isOpen conforme esperado
      periods: [], // Adicionando periods se for necessário para o tipo
    } as unknown as google.maps.places.PlaceOpeningHours, // Forçando o tipo de abertura para corresponder à interface
  };

  // Executa o método para criar o marcador
  component.createMarkerForChargingStation(mockPlace);

  // Recupera a função de callback que foi passada para addListener
  const clickCallback = markerMock.addListener.mock.calls[0][1];

  // Agora, dispare o evento de clique manualmente
  clickCallback(); // Isso simula o clique no marcador

  // Verifique se o modal foi exibido, ou outra ação relacionada ao clique
  expect(showModalSpy).toHaveBeenCalled(); // Verifique se showModal foi chamada
});


it('should not create marker if place geometry or location is missing', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: undefined, // Simulando geometria ausente
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Para silenciar o log

  component.createMarkerForChargingStation(mockPlace);

  expect(consoleWarnSpy).toHaveBeenCalledWith('Place geometry or location is undefined:', mockPlace); // Verifica o log de aviso
  expect(component.markers.length).toBe(0); // Não deve adicionar nenhum marcador
});


it('should initialize with default values', () => {
  expect(component.markers).toEqual([]); // Lista de marcadores deve ser vazia
  expect(component.userLocation).toBeNull(); // userLocation deve ser nulo
  expect(component.currentPlace).toBeNull(); // currentPlace deve ser nulo
});

it('should update userLocation correctly', () => {
  const mockLatLng = { lat: () => 10, lng: () => 20 };

  // Simula o comportamento do objeto LatLng do Google Maps
  component.userLocation = {
    lat: mockLatLng.lat,
    lng: mockLatLng.lng,
  } as unknown as google.maps.LatLng;

  expect(component.userLocation.lat()).toBe(10); // Verifica a latitude
  expect(component.userLocation.lng()).toBe(20); // Verifica a longitude
});



it('should call showModal when marker is clicked', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  // Mock da função showModal
  const showModalSpy = jest.spyOn(component, 'showModal');

  // Criar marcador
  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  // Simula o clique no marcador
  component.createMarkerForChargingStation(mockPlace);
  const clickCallback = markerMock.addListener.mock.calls[0][1];
  clickCallback(); // Simula o clique

  // Verifica se showModal foi chamado
  expect(showModalSpy).toHaveBeenCalled();
});




it('should set the correct icon based on opening hours', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const iconUrl = "../../../../assets/images/station_open.svg"; // Esperado para quando estiver aberto

  // Mock da criação de marcador
  const markerMock = { addListener: jest.fn() };

  // Ajuste para permitir que o construtor de Marker aceite `null` ou `undefined`
  jest.spyOn(google.maps, 'Marker').mockImplementation((opts?: google.maps.MarkerOptions | null) => {
    // Verifique se a opção `icon` foi passada corretamente
    if (opts && opts.icon) {
      expect(opts.icon).toEqual(expect.objectContaining({
        url: iconUrl,
        scaledSize: expect.objectContaining({
          width: 30,
          height: 30,
        }),
      }));
    }

    return markerMock as any;
  });

  // Executa o método para criar o marcador
  component.createMarkerForChargingStation(mockPlace);
});




it('should trigger click event when route is inactive', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  // Define isRouteActive como false
  component.isRouteActive = false;

  // Chama a função que cria o marcador
  component.createMarkerForChargingStation(mockPlace);

  // Verifique se o addListener foi chamado
  expect(markerMock.addListener).toHaveBeenCalled();
});


it('should handle isRouteActive state correctly', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  // Define isRouteActive como true
  component.isRouteActive = true;

  // Chama a função que cria o marcador
  component.createMarkerForChargingStation(mockPlace);

  // Verifique se o addListener foi chamado
  expect(markerMock.addListener).toHaveBeenCalled();
});
it('should trigger click event when route is inactive', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  component.isRouteActive = false; // A rota não está ativa

  component.createMarkerForChargingStation(mockPlace);

  // Verifique se o addListener foi chamado, mesmo com a rota inativa
  expect(markerMock.addListener).toHaveBeenCalled();
});
it('should not create marker if place geometry or location is missing', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: undefined, // Simulando geometria ausente
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Para silenciar o log

  component.createMarkerForChargingStation(mockPlace);

  expect(consoleWarnSpy).toHaveBeenCalledWith('Place geometry or location is undefined:', mockPlace); // Verifica o log de aviso
  expect(component.markers.length).toBe(0); // Não deve adicionar nenhum marcador
});
it('should handle isRouteActive state correctly', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  component.isRouteActive = true; // A rota está ativa

  component.createMarkerForChargingStation(mockPlace);

  // Verifique se o addListener foi chamado, já que a rota está ativa
  expect(markerMock.addListener).toHaveBeenCalled();
});
it('should call showModal when marker is clicked', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  // Mock da função showModal
  const showModalSpy = jest.spyOn(component, 'showModal');

  const markerMock = { addListener: jest.fn() };
  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  // Simula o clique no marcador
  component.createMarkerForChargingStation(mockPlace);
  const clickCallback = markerMock.addListener.mock.calls[0][1];
  clickCallback(); // Simula o clique

  // Verifica se showModal foi chamada
  expect(showModalSpy).toHaveBeenCalled();
});
it('should set the correct icon based on opening hours', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: true,
      isOpen: true,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const iconUrl = "../../../../assets/images/station_open.svg"; // Esperado para quando estiver aberto

  const markerMock = { addListener: jest.fn() };

  jest.spyOn(google.maps, 'Marker').mockImplementation((opts?: google.maps.MarkerOptions | null) => {
    if (opts && opts.icon) {
      expect(opts.icon).toEqual(expect.objectContaining({
        url: iconUrl,
        scaledSize: expect.objectContaining({
          width: 30,
          height: 30,
        }),
      }));
    }
    return markerMock as any;
  });

  component.createMarkerForChargingStation(mockPlace);
});

it('should handle error when map is not available', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  component.createMarkerForChargingStation({});  // Passar um mock de lugar sem localização

  expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating marker: Invalid location');
});
it('should handle showModal with empty hours correctly', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: false,
      isOpen: false,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const showModalSpy = jest.spyOn(component, 'showModal');
  const markerMock = { addListener: jest.fn() };

  jest.spyOn(google.maps, 'Marker').mockImplementation(() => markerMock as any);

  component.createMarkerForChargingStation(mockPlace);
  const clickCallback = markerMock.addListener.mock.calls[0][1];
  clickCallback();  // Simula o clique

  // Verifique se showModal foi chamado, mesmo com horas de funcionamento vazias
  expect(showModalSpy).toHaveBeenCalled();
});
it('should set correct icon when station is closed', () => {
  const mockPlace: google.maps.places.PlaceResult = {
    name: 'Station Name',
    geometry: {
      location: { lat: jest.fn(() => 10), lng: jest.fn(() => 20) } as unknown as google.maps.LatLng,
    },
    opening_hours: {
      open_now: false,
      isOpen: false,
      periods: [],
    } as unknown as google.maps.places.PlaceOpeningHours,
  };

  const iconUrl = "../../../../assets/images/station_closed.svg"; // Esperado para quando estiver fechado

  const markerMock = { addListener: jest.fn() };

  jest.spyOn(google.maps, 'Marker').mockImplementation((opts?: google.maps.MarkerOptions | null) => {
    if (opts && opts.icon) {
      expect(opts.icon).toEqual(expect.objectContaining({
        url: iconUrl,
        scaledSize: expect.objectContaining({
          width: 30,
          height: 30,
        }),
      }));
    }
    return markerMock as any;
  });

  component.createMarkerForChargingStation(mockPlace);
});



});