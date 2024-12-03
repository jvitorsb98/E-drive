import { FormControl } from '@angular/forms';
import { noNumbersValidator } from './no-numbers.validator';

describe('noNumbersValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    // Configura o controle de formulário
    control = new FormControl('');
  });

  it('não deve retornar erro se o campo estiver vazio', () => {
    control.setValue(''); // Teste com campo vazio
    const result = noNumbersValidator(control);
    expect(result).toBeNull(); // Não deve retornar erro para campo vazio
  });

  it('não deve retornar erro se o valor não contiver números', () => {
    control.setValue('Texto sem números'); // Teste com valor sem números
    const result = noNumbersValidator(control);
    expect(result).toBeNull(); // Não deve retornar erro se não houver números
  });

  it('deve retornar erro "hasNumbers" se o valor contiver números', () => {
    control.setValue('Texto com 123 números'); // Teste com valor contendo números
    const result = noNumbersValidator(control);
    expect(result).toEqual({ hasNumbers: true }); // Espera erro "hasNumbers"
  });

  it('deve retornar erro "hasNumbers" se o valor for apenas números', () => {
    control.setValue('123456'); // Teste com valor numérico
    const result = noNumbersValidator(control);
    expect(result).toEqual({ hasNumbers: true }); // Espera erro "hasNumbers"
  });
});
