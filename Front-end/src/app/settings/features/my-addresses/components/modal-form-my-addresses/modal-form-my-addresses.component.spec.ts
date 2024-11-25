import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModalFormMyAddressesComponent } from './modal-form-my-addresses.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { AddressService } from '../../../../core/services/Address/address.service';
import { PostalCodeService } from '../../../../core/services/apis/postal-code/postal-code.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataAddressDetails } from '../../../../core/models/inter-Address';

describe('ModalFormMyAddressesComponent', () => {
  let component: ModalFormMyAddressesComponent;
  let fixture: ComponentFixture<ModalFormMyAddressesComponent>;
  let addressServiceMock: jest.Mocked<AddressService>;
  let postalCodeServiceMock: jest.Mocked<PostalCodeService>;
  let alertasServiceMock: jest.Mocked<AlertasService>;
  let dialogRefMock: jest.Mocked<MatDialogRef<ModalFormMyAddressesComponent>>;

  const mockAddress: DataAddressDetails = {
    id: 1,
    city: 'City Example',
    neighborhood: 'Neighborhood Example',
    state: 'State Example',
    street: 'Street Example',
    country: 'Brasil',
    zipCode: '00000000',
    number: 123,
    complement: '',
    hasChargingStation: false,
    activated: false,
    userId: 0,
  };

  const mockDialogData = {
    addressData: mockAddress,
    actionTitle: 'Edit Address'
  };

  beforeEach(async () => {
    addressServiceMock = {
      register: jest.fn(),
      update: jest.fn(),
      listAll: jest.fn(),
      disable: jest.fn(),
    } as unknown as jest.Mocked<AddressService>;

    postalCodeServiceMock = {
      searchPostalCode: jest.fn(),
    } as unknown as jest.Mocked<PostalCodeService>;

    alertasServiceMock = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn(),
    } as unknown as jest.Mocked<AlertasService>;

    dialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ModalFormMyAddressesComponent>>;

    await TestBed.configureTestingModule({
      declarations: [ModalFormMyAddressesComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: AddressService, useValue: addressServiceMock },
        { provide: PostalCodeService, useValue: postalCodeServiceMock },
        { provide: AlertasService, useValue: alertasServiceMock },
        MatDialog
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormMyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize form with address data', () => {
    expect(component).toBeTruthy();
    expect(component.addressForm.value).toEqual({
      city: 'City Example',
      neighborhood: 'Neighborhood Example',
      state: 'State Example',
      street: 'Street Example',
      country: 'Brasil',
      zipCode: '00000000',
      number: 123,
      complement: '',
      hasChargingStation: false
    });
    expect(component.actionTitle).toBe('Edit Address');
  });

  it('should show error if creating address fails', async () => {
    const errorResponse = new HttpErrorResponse({ error: { message: 'Error creating address' } });
    addressServiceMock.register.mockReturnValue(throwError(() => errorResponse));

    component.create();

    await fixture.whenStable(); // Aguarda que o observable seja resolvido

    expect(addressServiceMock.register).toHaveBeenCalled();
    expect(alertasServiceMock.showError).toHaveBeenCalledWith('Erro ao criar endereço !!', 'Error creating address');
  });

  it('should show error if updating address fails', async () => {
    const errorResponse = new HttpErrorResponse({ error: { message: 'Error updating address' } });
    addressServiceMock.update.mockReturnValue(throwError(() => errorResponse));

    component.edit();

    await fixture.whenStable(); // Aguarda que o observable seja resolvido

    expect(addressServiceMock.update).toHaveBeenCalled();
    expect(alertasServiceMock.showError).toHaveBeenCalledWith('Atualização de endereço falhou', 'Error updating address');
  });

  it('should call searchPostalCode when zipCode changes and is valid', () => {
    component.addressForm.patchValue({ zipCode: '00000000' });
    postalCodeServiceMock.searchPostalCode.mockReturnValue(of({
      uf: 'SP',
      localidade: 'City',
      bairro: 'Neighborhood',
      logradouro: 'Street'
    }));

    component.searchPostalCode();

    expect(postalCodeServiceMock.searchPostalCode).toHaveBeenCalledWith('00000000');
    expect(component.addressForm.value.state).toBe('SP');
    expect(component.addressForm.value.city).toBe('City');
    expect(component.addressForm.value.neighborhood).toBe('Neighborhood');
    expect(component.addressForm.value.street).toBe('Street');
  });

  it('should show error if postalCode search fails', () => {
    const errorResponse = new HttpErrorResponse({ error: { message: 'Postal code not found' } });
    postalCodeServiceMock.searchPostalCode.mockReturnValue(throwError(() => errorResponse));

    component.searchPostalCode();

    expect(postalCodeServiceMock.searchPostalCode).toHaveBeenCalledWith('00000000');
    expect(alertasServiceMock.showError).toHaveBeenCalledWith('Erro ao buscar CEP!', 'Postal code not found');
  });

  it('should be valid when all fields are correctly filled', () => {
    component.addressForm.patchValue({
      city: 'New City',
      neighborhood: 'New Neighborhood',
      state: 'New State',
      street: 'New Street',
      country: 'Brazil',
      zipCode: '12345678',
      number: 456,
      complement: 'Apt 101',
      hasChargingStation: true
    });
  
    expect(component.addressForm.valid).toBeTruthy();
  });
  
  it('should call update with correct data when editing an address', () => {
    // Mock do retorno da atualização, incluindo todas as propriedades de DataAddressDetails
    addressServiceMock.update.mockReturnValue(of({
      id: 1,
      city: 'New City',
      neighborhood: 'New Neighborhood',
      state: 'New State',
      street: 'New Street',
      country: 'Brazil',
      zipCode: '12345678',
      number: 789,
      complement: 'House 102',
      hasChargingStation: false,
      userId: 0,  // Adicionando a propriedade userId
      activated: false,  // Adicionando a propriedade activated
    }));
  
    component.edit();
  
    // Verificar se o serviço foi chamado com os dados corretos
    expect(addressServiceMock.update).toHaveBeenCalledWith(mockAddress.id, component.addressForm.value);
  
    // Verificar se o alert de sucesso foi chamado
    expect(alertasServiceMock.showSuccess).toHaveBeenCalledWith('Atualização de endereço !!', 'Endereço atualizado com sucesso!');
  });
 

 
  
  it('should update form fields with postal code data when search is successful', () => {
    // Dados simulados de sucesso da busca do CEP
    const mockData = {
      uf: 'SP',
      localidade: 'São Paulo',
      bairro: 'Centro',
      logradouro: 'Rua Exemplo',
    };
  
    // Configura o mock do serviço para retornar dados de sucesso
    postalCodeServiceMock.searchPostalCode.mockReturnValue(of(mockData));
  
    // Chama o método que realiza a busca do CEP
    component.searchPostalCode();
  
    // Verifica se os campos foram atualizados corretamente com os dados retornados
    expect(component.addressForm.value.state).toBe('SP');
    expect(component.addressForm.value.city).toBe('São Paulo');
    expect(component.addressForm.value.neighborhood).toBe('Centro');
    expect(component.addressForm.value.street).toBe('Rua Exemplo');
    
    // Verifica se o alerta de erro não foi chamado
    expect(alertasServiceMock.showError).not.toHaveBeenCalled();
  });

  

  it('should invalidate zipCode field if invalid format is entered', () => {
    component.addressForm.patchValue({
      zipCode: 'invalidZipCode'
    });
  
    fixture.detectChanges();
  
    const zipCodeControl = component.addressForm.get('zipCode');
    expect(zipCodeControl?.invalid).toBeTruthy();
  });


  
  

});