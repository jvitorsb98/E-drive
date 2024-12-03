import { AbstractControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './confirm-password.validators';

describe('passwordMatchValidator', () => {
  let control: AbstractControl;

  beforeEach(() => {
    // Inicializa o controle de formulário com um FormGroup simulado
    control = {
      get: jest.fn()
    } as unknown as AbstractControl;
  });

  it('não deve retornar erro quando as senhas coincidirem', () => {
    // Simula um FormGroup com senhas iguais
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'password' ? { value: 'senha123' } : { value: 'senha123' };
      })
    } as unknown as FormGroup;

    const result = passwordMatchValidator(formGroup);
    expect(result).toBeNull(); // Não deve retornar erro quando as senhas coincidirem
  });

  it('deve retornar erro "passwordMismatch" quando as senhas não coincidirem', () => {
    // Simula um FormGroup com senhas diferentes
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'password' ? { value: 'senha123' } : { value: 'senha456' };
      })
    } as unknown as FormGroup;

    const result = passwordMatchValidator(formGroup);
    expect(result).toEqual({ passwordMismatch: true }); // Deve retornar erro de mismatch
  });

  it('deve retornar erro "passwordMismatch" quando o campo de senha não for preenchido', () => {
    // Simula um FormGroup com um campo de senha vazio
    const formGroup = {
      get: jest.fn((name: string) => {
        return name === 'password' ? { value: '' } : { value: 'senha123' };
      })
    } as unknown as FormGroup;

    const result = passwordMatchValidator(formGroup);
    expect(result).toEqual({ passwordMismatch: true }); // Deve retornar erro de mismatch
  });

  it('não deve retornar erro quando ambos os campos estiverem vazios', () => {
    // Simula um FormGroup com ambos os campos de senha vazios
    const formGroup = {
      get: jest.fn((name: string) => {
        return { value: '' };
      })
    } as unknown as FormGroup;

    const result = passwordMatchValidator(formGroup);
    expect(result).toBeNull(); // Não deve retornar erro se ambos os campos estiverem vazios
  });
});
