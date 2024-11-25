import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailsAddressComponent } from './modal-details-address.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DataAddressDetails } from '../../../../core/models/inter-Address';

describe('ModalDetailsAddressComponent', () => {
  let component: ModalDetailsAddressComponent;
  let fixture: ComponentFixture<ModalDetailsAddressComponent>;
  let dialogRefMock: MatDialogRef<ModalDetailsAddressComponent>;

  const mockAddress: DataAddressDetails = {
    id: 1,
    city: 'City Example',
    neighborhood: 'Neighborhood Example',
    state: 'State Example',
    street: 'Street Example',
    country: '',
    zipCode: '',
    number: 0,
    userId: 0,
    hasChargingStation: false,
    complement: '',
    activated: false
  };
  

  beforeEach(async () => {
    // Criar o mock do MatDialogRef
    dialogRefMock = {
      close: jest.fn(),
    } as unknown as MatDialogRef<ModalDetailsAddressComponent>;

    await TestBed.configureTestingModule({
      declarations: [ModalDetailsAddressComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockAddress },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailsAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize address correctly', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado corretamente
    expect(component.address).toEqual(mockAddress); // Verifica se os dados foram injetados corretamente
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal(); // Chama o método de fechar modal

    expect(dialogRefMock.close).toHaveBeenCalled(); // Verifica se o método close foi chamado
  });
});