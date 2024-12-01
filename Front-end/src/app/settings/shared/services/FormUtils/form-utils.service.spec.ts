import { TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { FormUtilsService } from './form-utils.service';

describe('FormUtilsService', () => {
  let service: FormUtilsService;
  let form: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUtilsService);

    // Criando um FormGroup mock
    form = new FormGroup({
      brand: new FormControl(''),
      model: new FormControl(''),
      type: new FormControl(''),
      category: new FormControl(''),
      propulsion: new FormControl(''),
      motor: new FormControl('')
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should observe field changes and enable the next field when valid', () => {
    // Mock do campo "brand" sendo alterado
    const spy = jest.spyOn(service, 'toggleField');
    service.observeFieldChanges(form, 'brand', 'model');

    // Alterando o valor do campo "brand" para um valor válido
    form.get('brand')?.setValue('Valid Brand');
    form.get('brand')?.markAsTouched();

    expect(spy).toHaveBeenCalledWith(form, 'model', true); // Verifica se o próximo campo foi habilitado
  });

  it('should toggle the field based on the enable flag', () => {
    const field = form.get('model');
    service.toggleField(form, 'model', true);
    expect(field?.enabled).toBeTruthy(); // Verifica se o campo foi habilitado

    service.toggleField(form, 'model', false);
    expect(field?.disabled).toBeTruthy(); // Verifica se o campo foi desabilitado
  });

  it('should disable all fields', () => {
    service.disableAllFields(form, ['brand', 'model', 'type']);
    expect(form.get('brand')?.disabled).toBeTruthy();
    expect(form.get('model')?.disabled).toBeTruthy();
    expect(form.get('type')?.disabled).toBeTruthy();
  });

  it('should toggle multiple fields based on conditions', () => {
    const fieldsCondition = [
      { name: 'brand', condition: true },
      { name: 'model', condition: false },
      { name: 'type', condition: true }
    ];

    const spy = jest.spyOn(service, 'toggleField');

    service.toggleMultipleFields(form, fieldsCondition);

    expect(spy).toHaveBeenCalledWith(form, 'brand', true);
    expect(spy).toHaveBeenCalledWith(form, 'model', false);
    expect(spy).toHaveBeenCalledWith(form, 'type', true);
  });

  it('should update form field, enable next field and call loadFunction', () => {
    const loadFunction = jest.fn();
    const selectedValue = { id: 1, name: 'Brand 1' };

    service.updateFormField(form, 'brand', selectedValue, loadFunction, 'model');

    expect(form.get('brand')?.value).toBe('Brand 1'); // Verifica se o valor foi setado corretamente
    expect(form.get('model')?.enabled).toBeTruthy(); // Verifica se o próximo campo foi habilitado
    expect(loadFunction).toHaveBeenCalledWith(1); // Verifica se a função de carga foi chamada com o id correto
  });

  it('should reset and disable fields', () => {
    service.resetAndDisableFields(form, ['brand', 'model']);

    expect(form.get('brand')?.value).toBeNull(); // Verifica se o valor foi resetado
    expect(form.get('brand')?.disabled).toBeTruthy(); // Verifica se o campo foi desabilitado
    expect(form.get('model')?.value).toBeNull(); // Verifica se o valor foi resetado
    expect(form.get('model')?.disabled).toBeTruthy(); // Verifica se o campo foi desabilitado
  });
});
