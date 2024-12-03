import { TestBed } from '@angular/core/testing';
import { MyAddressesModule } from './my-addresses.module';
import { ListMyAddressesComponent } from './components/list-my-addresses/list-my-addresses.component';
import { ModalDetailsAddressComponent } from './components/modal-details-address/modal-details-address.component';
import { ModalFormMyAddressesComponent } from './components/modal-form-my-addresses/modal-form-my-addresses.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

describe('MyAddressesModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MyAddressesModule,
        CommonModule, 
        SharedModule, 
        AngularMaterialModule,
      ]
    }).compileComponents();
  });

  it('should create the module and components', () => {
    const fixture = TestBed.createComponent(ListMyAddressesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy(); // Verifica se o componente da lista foi criado

    const fixtureModalDetails = TestBed.createComponent(ModalDetailsAddressComponent);
    const componentModalDetails = fixtureModalDetails.componentInstance;
    expect(componentModalDetails).toBeTruthy(); // Verifica se o componente de modal de detalhes foi criado

    const fixtureModalForm = TestBed.createComponent(ModalFormMyAddressesComponent);
    const componentModalForm = fixtureModalForm.componentInstance;
    expect(componentModalForm).toBeTruthy(); // Verifica se o componente do modal de formulário foi criado
  });
});
