import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

// Mock para AuthService
const authServiceMock = {
  logout: jest.fn()
};

// Mock para Router
const routerMock = {
  navigate: jest.fn()
};

// Mock para Google Maps
const geocoderMock = {
  geocode: jest.fn()
};

const mapMock = {
  setCenter: jest.fn(),
  setZoom: jest.fn()
};

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.map = mapMock; // Injetamos o mock do mapa
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth.logout on logout', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should call geocoder.geocode with searchTerm on search', () => {
    component.searchTerm = 'Some location';
    
    // Mock da função global google.maps.Geocoder
    (global as any).google = {
      maps: {
        Geocoder: jest.fn().mockImplementation(() => geocoderMock),
        Marker: jest.fn()
      }
    };

    geocoderMock.geocode.mockImplementation((_request, callback) => {
      // Simula chamada com callback para a resposta do geocode
      callback([{ geometry: { location: { lat: 0, lng: 0 } } }], 'OK');
    });

    component.search();

    expect(geocoderMock.geocode).toHaveBeenCalledWith(
      { address: 'Some location' },
      expect.any(Function)
    );
  });
  it('should set map center and zoom on successful geocode', () => {
    component.searchTerm = 'Some location';

    // Configura o mock de geocode para chamar o callback com uma resposta de sucesso
    geocoderMock.geocode.mockImplementation((_request, callback) => {
      callback([{ geometry: { location: { lat: 0, lng: 0 } } }], 'OK');
    });

    component.search();

    expect(mapMock.setCenter).toHaveBeenCalledWith({ lat: 0, lng: 0 });
    expect(mapMock.setZoom).toHaveBeenCalledWith(14);
  });

  it('should log an error on unsuccessful geocode', () => {
    console.error = jest.fn(); // Mock do console.error

    component.searchTerm = 'Invalid location';

    // Configura o mock de geocode para chamar o callback com uma resposta de erro
    geocoderMock.geocode.mockImplementation((_request, callback) => {
      callback([], 'ZERO_RESULTS');
    });

    component.search();

    expect(console.error).toHaveBeenCalledWith(
      'Geocode was not successful for the following reason: ZERO_RESULTS'
    );
  });
});