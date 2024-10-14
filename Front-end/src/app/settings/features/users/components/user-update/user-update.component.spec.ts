import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserUpdateComponent } from './user-update.component';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';

// Mocks dos serviços
const mockUserService = {
  getAuthenticatedUserDetails: jest.fn(),
  update: jest.fn(),
  deactivate: jest.fn(),
  getUserEmail: jest.fn(),
  getUserID: jest.fn(),
  logout: jest.fn(),
};

const mockCountryService = {
  getCountries: jest.fn(),
};

const mockAlertasService = {
  showWarning: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
};

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserUpdateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: CountryService, useValue: mockCountryService },
        { provide: AlertasService, useValue: mockAlertasService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;

    // Mockando o retorno dos métodos
    mockUserService.getAuthenticatedUserDetails.mockReturnValue(of({
      name: 'Test User',
      email: 'test@example.com',
      birth: '1990-01-01T00:00:00Z',
      cellPhone: '+55 11 99999-9999',
    }));

    mockCountryService.getCountries.mockReturnValue(of([
      { idd: { root: '+1', suffixes: ['23'] }, name: { common: 'Country1' } },
      { idd: { root: '+44', suffixes: ['56'] }, name: { common: 'Country2' } },
    ]));

    component.ngOnInit();
    fixture.detectChanges(); // Chama o ngOnInit e atualiza o componente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.userForm.get('name')!.value).toEqual('Test User');
    expect(component.userForm.get('email')!.value).toEqual('test@example.com');
  });
  it('should call updateUser when form is valid', () => {
    component.userForm.setValue({
      name: 'Updated User',
      email: 'updated@example.com',
      birth: new Date(),
      cellPhone: '999999999',
      countryCode: '55',
    });
  
    mockUserService.update.mockReturnValue(of({}));
  
    component.updateUser();
  
    expect(mockUserService.update).toHaveBeenCalledWith({
      name: 'Updated User',
      email: 'updated@example.com',
      birth: expect.any(Date),
      cellPhone: '+55 (99) 99999-99', // Valor ajustado aqui
      countryCode: '55',
    });
  });
  
  it('should mark the form as invalid when fields are empty', () => {
    component.userForm.setValue({
      name: '',
      email: '',
      birth: null,
      cellPhone: '',
      countryCode: '',
    });
    expect(component.userForm.valid).toBeFalsy();
  });
  
  
  it('should show error message when email is invalid', () => {
    component.userForm.get('email')?.setValue('invalid-email');
    fixture.detectChanges();
  
    // Você pode verificar se uma mensagem de erro específica é exibida aqui
    const emailErrors = component.userForm.get('email')?.errors;
    expect(emailErrors).toBeTruthy();
    expect(emailErrors?.['email']).toBeTruthy(); // Assumindo que você está usando o validador de email
  });

  
  it('should mark the form as invalid when email is missing', () => {
    component.userForm.get('email')?.setValue('');
    expect(component.userForm.valid).toBeFalsy();
  });
  
  
});
