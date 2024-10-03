import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailsVehicleComponent } from './modal-details-vehicle.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../../../../core/models/vehicle';

describe('ModalDetailsVehicleComponent', () => {
  let component: ModalDetailsVehicleComponent;
  let fixture: ComponentFixture<ModalDetailsVehicleComponent>;

  const mockDialogRef = {
    close: jest.fn() // Simula o método close do MatDialogRef
  };

  const mockVehicle: Vehicle = {
    // Substitua com as propriedades reais do modelo Vehicle
    id: 1,
    motor: 'V8',
    version: '2021',
    model: {
      id: 1, name: 'Model 1', brand: { id: 1, name: 'Brand 1', activated: true },
      activated: false
    },
    category: {
      id: 1, name: 'SUV',
      activated: false
    },
    type: {
      id: 1, name: 'Gasoline',
      activated: false
    },
    propulsion: {
      id: 1, name: 'Hybrid',
      activated: false
    },
    year: 2021,
    autonomy: { autonomyElectricMode: 50, consumptionEnergetic: 15, mileagePerLiterCity: 12, mileagePerLiterRoad: 18 },
    activated: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailsVehicleComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockVehicle } // Passa os dados do veículo
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetailsVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Executa a detecção de mudanças
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('should initialize vehicle data correctly', () => {
    expect(component.vehicle).toEqual(mockVehicle); // Verifica se os dados do veículo foram inicializados corretamente
  });

  it('should close the modal', () => {
    component.closeModal(); // Chama o método para fechar o modal
    expect(mockDialogRef.close).toHaveBeenCalled(); // Verifica se o método close foi chamado
  });
});
