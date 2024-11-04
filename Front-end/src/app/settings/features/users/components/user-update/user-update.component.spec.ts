import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserUpdateComponent } from './user-update.component';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;
  let userServiceMock: any;
  let countryServiceMock: any;
  let alertServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getAuthenticatedUserDetails: jest.fn(),
      update: jest.fn()
    };

    countryServiceMock = {
      getCountries: jest.fn().mockReturnValue(of([]))
    };

    alertServiceMock = {
      showSuccess: jest.fn().mockReturnValue(Promise.resolve(true)),
      showError: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [UserUpdateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: CountryService, useValue: countryServiceMock },
        { provide: AlertasService, useValue: alertServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;

    userServiceMock.getAuthenticatedUserDetails.mockReturnValue(of({
      name: 'Test User',
      email: 'test@example.com',
      birth: '2000-01-01',
      cellPhone: '+55 12345-6789'
    }));

    countryServiceMock.getCountries.mockReturnValue(of([
      { name: 'Brazil', idd: { root: '+55', suffixes: [] } },
      { name: 'United States', idd: { root: '+1', suffixes: [] } }
    ]));


    component.ngOnInit();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar a lista de países ao inicializar', () => {
    expect(component.countries.length).toBe(2);
    expect(component.filteredCountries).toBeDefined();
  });

  it('deve carregar os dados do usuário ao inicializar', () => {
    userServiceMock.getAuthenticatedUserDetails.mockReturnValue(of({
      name: 'Test User',
      email: 'test@example.com',
      birth: '2000-01-01',
      cellPhone: '+55 12345-6789'
    }));
  
    // Inicializa o componente
    component.ngOnInit(); // Chama o método público que deve acionar loadUserData
  
    // Cria a data de nascimento conforme a lógica do loadUserData
    const birthDate = new Date('2000-01-01');
    const userBirthDate = new Date(birthDate.getTime() + birthDate.getTimezoneOffset() * 60000);
  
    // Verifica se os dados do formulário foram preenchidos corretamente
    expect(component.userForm.value).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      birth: userBirthDate, // Use a data ajustada aqui
      cellPhone: '12345-6789',
      countryCode: '+55',
    });
  });
  
  

  it('deve atualizar os dados do usuário', () => {
    component.userForm.patchValue({
      name: 'Updated User',
      email: 'updated@example.com',
      birth: '2000-01-01',
      cellPhone: '123456789',
      countryCode: '55'
    });

    userServiceMock.update.mockReturnValue(of({}));

    component.updateUser();

    expect(userServiceMock.update).toHaveBeenCalledWith({
      name: 'Updated User',
      email: 'updated@example.com',
      birth: '2000-01-01',
      cellPhone: '55 (12) 34567-89', // Verifica a formatação do número
      countryCode: '55'
    });
  });

  it('deve mostrar um erro ao atualizar usuário', () => {
    userServiceMock.update.mockReturnValue(throwError(() => new Error('Update failed')));

    component.updateUser();

    expect(alertServiceMock.showError).toHaveBeenCalledWith('Erro ao atualizar usuário', 'Update failed');
  });

  it('deve habilitar o formulário em modo de edição', () => {
    component.editData();

    expect(component.isEditing).toBe(true);
    expect(component.userForm.enabled).toBe(true);
    expect(component.isButtonVisible).toBe(false);
  });

  it('deve cancelar a edição e recarregar os dados', () => {
    component.cancelEdit();

    expect(component.isEditing).toBe(false);
    expect(component.userForm.disabled).toBe(true);
    expect(component.isButtonVisible).toBe(true);
    expect(routerMock.navigate).toHaveBeenCalledWith(['e-driver/users/myinfo']);
  });

  it('deve definir as datas mínima e máxima ao inicializar', () => {
    // Chama o ngOnInit para disparar a inicialização
    component.ngOnInit();
  
    // Verifica se minDate e maxDate foram definidos
    expect(component.minDate).toBeDefined();
    expect(component.maxDate).toBeDefined();
  });
  
 
});
