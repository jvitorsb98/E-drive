import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRegistrationFormComponent } from './user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; // Importando MatAutocompleteModule
import { PhoneMaskPipe } from '../../../../shared/pipes/phone-mask.pipe';

describe('UserRegistrationFormComponent', () => {
  let component: UserRegistrationFormComponent;
  let fixture: ComponentFixture<UserRegistrationFormComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockRouter: jest.Mocked<Router>;
  let mockUserDataService: jest.Mocked<UserDataService>;
  let mockCountryService: jest.Mocked<CountryService>;

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockUserDataService = {
      formatAndStoreUserData: jest.fn(),
    } as unknown as jest.Mocked<UserDataService>;

    mockCountryService = {
      getCountries: jest.fn().mockReturnValue(of([
        { name: 'United States', idd: { root: '+1', suffixes: [] } },
        { name: 'Canada', idd: { root: '+1', suffixes: ['6', '5'] } },
      ])),
    } as unknown as jest.Mocked<CountryService>;

    await TestBed.configureTestingModule({
      declarations: [UserRegistrationFormComponent,  PhoneMaskPipe],
      imports: [ReactiveFormsModule, MatAutocompleteModule], // Adicionando MatAutocompleteModule
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: UserDataService, useValue: mockUserDataService },
        { provide: CountryService, useValue: mockCountryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form on initialization', () => {
    component.ngOnInit();
    expect(component.userForm).toBeDefined();
    expect(component.userForm.controls['name']).toBeDefined();
    expect(component.userForm.controls['email']).toBeDefined();
    expect(component.userForm.controls['birth']).toBeDefined();
    expect(component.userForm.controls['cellPhone']).toBeDefined();
    expect(component.userForm.controls['countryCode']).toBeDefined();
  });

  it('should open the modal when the form is valid', () => {
    // Mock the form as valid
    component.userForm.setValue({
      name: 'Test Name',
      email: 'test@example.com',
      birth: '2000-01-01',
      cellPhone: '123456789',
      countryCode: '+1'
    });
  
    component.userForm.markAsDirty(); // Garante que o formulário foi modificado
    component.userForm.updateValueAndValidity();
  
    // Chame o método que abre o modal
    component.continueToPasswordStep();
  
    // Verifique se o modal foi aberto
    expect(mockDialog.open).toHaveBeenCalled();
  });
  
  

  it('should not open modal for password user when form is invalid', () => {
    component.ngOnInit();
    component.continueToPasswordStep();
    expect(mockDialog.open).not.toHaveBeenCalled(); // Verificando que o modal não foi aberto
  });

  it('should filter countries based on user input', () => {
    component.countries = [
      { name: 'United States', code: 'US' },
      { name: 'Canada', code: 'CA' },
    ];
    
    // Simula o valor da entrada do usuário
    component.userForm.get('countryCode')?.setValue('united');
    
    // Chamando ngOnInit para atualizar filteredCountries
    component.ngOnInit();
    
    // Checa se a filtragem foi aplicada corretamente
    expect(component.filteredCountries).toBeDefined();
    component.filteredCountries.subscribe((countries) => {
      expect(countries).toEqual([{ name: 'United States', code: 'US' }]);
    });
  });

  it('should change the country code when onCountryChange is called', () => {
    component.countries = [
      { name: 'United States', code: 'US' },
      { name: 'Canada', code: 'CA' },
    ];
    component.onCountryChange('US');
    expect(component.userForm.get('countryCode')?.value).toBe('US');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']); // Verificando se a navegação ocorreu
  });
});
