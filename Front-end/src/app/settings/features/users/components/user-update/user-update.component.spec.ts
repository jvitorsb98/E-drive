import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserUpdateComponent } from './user-update.component';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PhoneMaskPipe } from '../../../../shared/pipes/phone-mask.pipe';

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
      declarations: [UserUpdateComponent, PhoneMaskPipe],
      imports: [ReactiveFormsModule, MatAutocompleteModule],
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

    // Mock do retorno de dados do usuário
    userServiceMock.getAuthenticatedUserDetails.mockReturnValue(of({
      name: 'Test User',
      email: 'test@example.com',
      birth: '2000-01-01',
      cellPhone: '+55 12345-6789'
    }));

    // Mock do retorno de lista de países
    countryServiceMock.getCountries.mockReturnValue(of([
      { name: 'Brazil', idd: { root: '+55', suffixes: [] } },
      { name: 'United States', idd: { root: '+1', suffixes: [] } }
    ]));

    // Inicializa o componente
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the list of countries on initialization', () => {
    expect(component.countries.length).toBe(2); // Verifica se dois países foram carregados
    expect(component.filteredCountries).toBeDefined(); // Verifica se o filtro foi configurado
  });

  it('should load the user data on initialization', () => {
    const birthDate = new Date('2000-01-01');
    const userBirthDate = new Date(birthDate.getTime() + birthDate.getTimezoneOffset() * 60000);

    expect(component.userForm.value).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      birth: userBirthDate,
      cellPhone: '12345-6789',
      countryCode: '+55',
    });
  });

  describe('updateUser function', () => {
    it('should update the user successfully', async () => {
      userServiceMock.update.mockReturnValue(of(null)); // Simula uma resposta de sucesso do serviço
    
      component.updateUser();
    
      // Aguarda que todas as operações assíncronas sejam concluídas
      await fixture.whenStable();
    
      // Verifique se o showSuccess foi chamado com as duas mensagens
      expect(alertServiceMock.showSuccess).toHaveBeenCalledWith(
        'Atualização bem-sucedida!', 
        'Os dados do usuário foram atualizados com sucesso.'
      );
    
      // Verifique se a navegação foi chamada com o caminho correto
      expect(routerMock.navigate).toHaveBeenCalledWith(['e-driver/users/myinfo']); 
    });
    
    it('should display error if the update fails', () => {
      userServiceMock.update.mockReturnValue(throwError(() => new Error('Erro ao atualizar usuário')));
    
      component.updateUser();
    
      expect(alertServiceMock.showError).toHaveBeenCalledWith(
        'Erro ao atualizar usuário', 
        'Erro ao atualizar usuário'
      );
    });
    
    it('should not update the user if the form is invalid', () => {
      component.userForm.setErrors({ invalid: true });

      component.updateUser();

      expect(alertServiceMock.showSuccess).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
