// Angular Core
import { Component } from '@angular/core';

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// RxJS
import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

// Angular Material
import { MatDialog } from '@angular/material/dialog';

// Angular Router
import { Router } from '@angular/router';

// Serviços e Modelos
import { User } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';

// Componentes
import { UserPasswordModalComponent } from '../user-password-modal/user-password-modal.component';

// Validators
import { countryCodeValidator } from '../../../../shared/validators/country-code.validators';
import { noNumbersValidator } from '../../../../shared/validators/no-numbers.validator';
import { emailExistsValidator } from '../../../../shared/validators/email-exists.validator';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  userForm!: FormGroup;
  phoneType: string = 'MOBILE';
  countries: any[] = [];
  filteredCountries!: Observable<any[]>; // Utilizado para filtrar países
  user!: User;
  users: User[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;

  constructor(
    private userDataService: UserDataService,
    private countryService: CountryService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  buildForm(_countries: { code: string }[] = []) {
    this.userForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), noNumbersValidator]),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
        // asyncValidators: [emailExistsValidator(this.userService)],
        updateOn: 'blur' // Verifica o e-mail quando o usuário sai do campo
      }),
      birth: new FormControl(null, Validators.required),
      cellPhone: new FormControl(null, Validators.required),
      countryCode: new FormControl(null, Validators.required)
    });
    if (_countries.length > 0) {
      this.userForm.setValidators(countryCodeValidator(_countries));
    }
  }

  ngOnInit() {
    this.setMinAndMaxDate();

    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data.map((country: any) => {
          const idd = country.idd || {};
          const root = idd.root || '';
          const suffixes = idd.suffixes || [];
          const code = root + (suffixes.length > 0 ? suffixes[0] : '');

          return {
            name: country.name?.common || 'Unknown',
            code: code
          };
        });

        // Inicializa o formulário após obter a lista de países
        this.buildForm(this.countries);

        // Inicializa filteredCountries após definir countries
        this.filteredCountries = this.userForm.get('countryCode')!.valueChanges.pipe(
          startWith(''),
          distinctUntilChanged(),
          map(value => this.filterCountries(value || ''))
        );
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados da API:', error);
      }
    });
  }

  continueToPasswordStep() {
    if (this.userForm.valid) {
      this.user = { ...this.userForm.value };
      this.user.cellPhone = this.userDataService.formatAndStoreUserData(this.userForm.get('countryCode')!.value, this.userForm.get('cellPhone')!.value);
      this.openModalPasswordUser();
    } else {
      console.log('Formulário inválido');
    }
  }

  // Filtra a lista de países com base na string de pesquisa, considerando nome e código.
  private filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  // Atualiza o código do país selecionado pelo usuário no formulário
  onCountryChange(code: string) {
    const country = this.countries.find(c => c.code === code);
    if (country) {
      // this.selectedCountryCode = country.code;
      this.userForm.get('countryCode')?.setValue(country.code);
    } else {
      console.error('Código do país não encontrado.');
    }
  }

  // Função para validar a data de nascimento do usuário
  private setMinAndMaxDate() {
    const date = new Date();
    this.minDate = new Date(date.getFullYear() - 100, 0, 1);
    this.maxDate = date;
  }

  // Função para abrir o modal de visualização de usuário
  openModalViewUser(user: User) {
    this.dialog.open(UserPasswordModalComponent, {
      width: '700px',
      height: '330px',
      data: user
    })
  }

  private openModalPasswordUser() {
    this.dialog.open(UserPasswordModalComponent, {
      width: '430px',
      height: '500px',
      data: this.user
    });
  }

  goBack() {
    // this.dialog.closeAll();
    this.router.navigate(['/']);
  }

}
