import { TestBed } from '@angular/core/testing';
import { MapStationsModule } from './map-stations.module';
import { MapStationsComponent } from './components/map-stations/map-stations.component';
import { ModalFormVehicleBatteryComponent } from './components/modal-form-vehicle-battery/modal-form-vehicle-battery.component';
import { ModalSelectAddressComponent } from './components/modal-select-address/modal-select-address.component';
import { PlanningTripComponent } from './components/planning-trip/planning-trip.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('MapStationsModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MapStationsModule, // Carrega o módulo MapStations
        RouterTestingModule, // Para testar com navegação sem um servidor
        CommonModule // Necessário para o CommonModule
      ]
    }).compileComponents();
  });

  it('should create the module', () => {
    const module = TestBed.inject(MapStationsModule);
    expect(module).toBeTruthy(); // Verifica se o módulo é criado corretamente
  });

  it('should declare the MapStationsComponent', () => {
    const fixture = TestBed.createComponent(MapStationsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verifica se o componente MapStations é instanciado corretamente
  });

  it('should declare the ModalFormVehicleBatteryComponent', () => {
    const fixture = TestBed.createComponent(ModalFormVehicleBatteryComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verifica se o componente ModalFormVehicleBattery é instanciado corretamente
  });

  it('should declare the ModalSelectAddressComponent', () => {
    const fixture = TestBed.createComponent(ModalSelectAddressComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verifica se o componente ModalSelectAddress é instanciado corretamente
  });

  it('should declare the PlanningTripComponent', () => {
    const fixture = TestBed.createComponent(PlanningTripComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verifica se o componente PlanningTrip é instanciado corretamente
  });
});
