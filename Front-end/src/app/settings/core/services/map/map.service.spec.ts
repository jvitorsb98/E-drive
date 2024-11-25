import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';
import { ElementRef } from '@angular/core';

// Mock para o ambiente
jest.mock('../../../../../environments/environment', () => ({
  environment: {
    googleMapsApiKey: 'FAKE_API_KEY'
  }
}));

// Declarando o tipo 'google' globalmente
declare global {
  interface Window {
    google: any;
  }
}

describe('MapService', () => {
  let service: MapService;

  // Mocks
  const mockElementRef: ElementRef = {
    nativeElement: document.createElement('div')
  };

  const googleMapsMock = {
    Map: jest.fn(),
    DirectionsService: jest.fn(),
    DirectionsRenderer: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
    })),
    MapTypeId: {
      ROADMAP: 'roadmap',
    },
  };

  beforeEach(() => {
    window.google = googleMapsMock;

    TestBed.configureTestingModule({
      providers: [MapService]
    });

    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('loadGoogleMapsScript', () => {
    it('should resolve if Google Maps is already loaded', async () => {
      window.google = { maps: {} };

      await expect(service.loadGoogleMapsScript()).resolves.toBeUndefined();
    });

    it('should load the Google Maps script if not already loaded', async () => {
      delete window.google;

      const appendChildSpy = jest.spyOn(document.head, 'appendChild');

      const promise = service.loadGoogleMapsScript();

      // Simula o carregamento bem-sucedido do script
      const scriptElement = appendChildSpy.mock.calls[0][0] as HTMLScriptElement;
      expect(scriptElement.src).toContain('https://maps.googleapis.com/maps/api/js?key=FAKE_API_KEY&libraries=places');
      expect(scriptElement.async).toBe(true);
      expect(scriptElement.defer).toBe(true);

      scriptElement.onload && scriptElement.onload(new Event('load'));
      await expect(promise).resolves.toBeUndefined();
    });
    
  });
});