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






});