import 'jest-preset-angular/setup-jest';

// Adicionar o mock da API do Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Mock da API do Google Maps
window.google = {
  maps: {
    MapTypeId: {
      ROADMAP: 'roadmap',  // Mock de MapTypeId
    },
    
    Marker: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
    })),
    LatLng: jest.fn().mockImplementation((lat: number, lng: number) => ({
      lat: jest.fn(() => lat),
      lng: jest.fn(() => lng),
    })),
    DirectionsService: jest.fn().mockImplementation(() => ({
      route: jest.fn().mockResolvedValue({
        status: 'OK',  // Mock de status de rota
        routes: [],    // Mock de rotas (pode incluir rotas reais ou vazias)
      }),
    })),
    DirectionsRenderer: jest.fn().mockImplementation(() => ({
      setDirections: jest.fn(),
    })),
  },
};
