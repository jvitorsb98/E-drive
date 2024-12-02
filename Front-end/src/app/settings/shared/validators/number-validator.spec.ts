import { FormControl } from '@angular/forms';
import { numberValidator } from './number-validator'; // Ajuste o caminho conforme necessário

describe('numberValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    // Configura o controle de formulário
    control = new FormControl('');
  });

  it('deve retornar null quando o valor for um número inteiro', () => {
    control.setValue(123); // Teste com número inteiro positivo
    const result = numberValidator()(control);
    expect(result).toBeNull(); // Se for um número inteiro, não deve retornar erro

    control.setValue(-456); // Teste com número inteiro negativo
    const result2 = numberValidator()(control);
    expect(result2).toBeNull(); // Se for um número inteiro, não deve retornar erro
  });

  it('deve retornar erro "notANumber" quando o valor for um número com ponto decimal', () => {
    control.setValue(123.45); // Teste com número decimal
    const result = numberValidator()(control);
    expect(result).toEqual({ notANumber: true }); // Espera erro "notANumber"

    control.setValue(-123.45); // Teste com número decimal negativo
    const result2 = numberValidator()(control);
    expect(result2).toEqual({ notANumber: true }); // Espera erro "notANumber"
  });

  it('deve retornar erro "notANumber" quando o valor for texto', () => {
    control.setValue('abc'); // Teste com valor de texto
    const result = numberValidator()(control);
    expect(result).toEqual({ notANumber: true }); // Espera erro "notANumber"
  });

  it('deve retornar erro "notANumber" quando o valor for vazio', () => {
    control.setValue(''); // Teste com campo vazio
    const result = numberValidator()(control);
    expect(result).toBeNull(); // Não retorna erro se o campo estiver vazio
  });
});
