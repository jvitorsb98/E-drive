import { AbstractControl, FormGroup } from '@angular/forms';
import { countryCodeValidator } from './country-code.validators';

describe('countryCodeValidator', () => {
  let control: AbstractControl;

  const mockCountries = [
    { code: 'US' },
    { code: 'BR' },
    { code: 'IN' }
  ];

  beforeEach(() => {
    // Inicializa o controle de formulário simulado
    control = {
      get: jest.fn()
    } as unknown as AbstractControl;
  });

  it('não deve retornar erro quando o código do país for válido', () => {
    // Simula o FormGroup com countryCode sendo "BR"
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'countryCode' ? { value: 'BR' } : null;
      }),
      setErrors: jest.fn(),
      markAsTouched: jest.fn()
    } as unknown as FormGroup;

    const result = countryCodeValidator(mockCountries)(formGroup);
    expect(result).toBeNull(); // Não deve retornar erro, pois o código "BR" é válido
  });

  it('deve retornar erro "invalidCountry" quando o código do país não for válido', () => {
    // Simula o FormGroup com countryCode sendo "DE" (não válido)
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'countryCode' ? { value: 'DE' } : null;
      }),
      setErrors: jest.fn(),
      markAsTouched: jest.fn()
    } as unknown as FormGroup;

    const result = countryCodeValidator(mockCountries)(formGroup);
    expect(result).toEqual({ invalidCountry: true }); // Deve retornar erro "invalidCountry"
  });

  it('não deve retornar erro quando o campo de countryCode estiver vazio', () => {
    // Simula o FormGroup com countryCode vazio
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'countryCode' ? { value: '' } : null;
      }),
      setErrors: jest.fn(),
      markAsTouched: jest.fn()
    } as unknown as FormGroup;

    const result = countryCodeValidator(mockCountries)(formGroup);
    expect(result).toBeNull(); // Não deve retornar erro, pois o campo está vazio
  });

  it('não deve retornar erro quando o código do país for uma string com espaços', () => {
    // Simula o FormGroup com countryCode sendo " US " (com espaços)
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'countryCode' ? { value: ' US ' } : null;
      }),
      setErrors: jest.fn(),
      markAsTouched: jest.fn()
    } as unknown as FormGroup;

    const result = countryCodeValidator(mockCountries)(formGroup);
    expect(result).toBeNull(); // Não deve retornar erro, pois " US " é válido após o trim
  });
});
