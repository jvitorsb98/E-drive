import { environment } from './environment.prod';

describe('Environment', () => {
  it('deve ter o modo de produção habilitado', () => {
    expect(environment.production).toBe(true);
  });

  it('deve ter a URL correta para a API', () => {
    expect(environment.apiUrl).toBe('http://localhost:8080');
  });

  it('deve ter uma chave de API do Google Maps válida', () => {
    expect(environment.googleMapsApiKey).toBeDefined();
    expect(environment.googleMapsApiKey).toMatch(/^AIza[0-9A-Za-z-_]{35}$/);
  });
});
