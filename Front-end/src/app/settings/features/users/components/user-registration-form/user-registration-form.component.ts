import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { User } from '../../../../core/models/User';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPasswordModalComponent } from '../user-password-modal/user-password-modal.component';
import { countryCodeValidator } from '../../../../shared/validators/country-code.validators';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  userForm!: FormGroup;
  selectedCountryCode: string = '+55';
  phoneType: string = 'MOBILE';
  countries: any[] = [];
  filteredCountries!: Observable<any[]>; // Utilizado para filtrar países
  user: User = new User();
  users: User[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;

  constructor(private userService: UserService,
    private countryService: CountryService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder) {
    this.buildForm();
  }

  buildForm(_countries: { code: string }[] = []) {
    this.userForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
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

  saveLocalStorage() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      this.concatenateAndStoreUserData(formData);
      this.openModalPasswordUser();
      this.userForm.reset();
    } else {
      console.log('Formulário inválido');
    }
  }

  private getListUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  private filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  onCountryChange(code: string) {
    const country = this.countries.find(c => c.code === code);
    if (country) {
      this.selectedCountryCode = country.code;
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

  // Função para abrir o modal de alteração de senha
  private openModalPasswordUser() {
    this.dialog.open(UserPasswordModalComponent, {
      width: '430px',
      height: '545px',
      data: this.user
    }).afterClosed().subscribe(() => this.getListUsers());
  }

  // Função para concatenar e armazenar os dados do usuário no Local Storage 
  private concatenateAndStoreUserData(userData: any): void {
    // Desestrutura o countryCode do userData
    let { countryCode, ...rest } = userData;

    // Remove o sinal de mais se já estiver presente no countryCode
    countryCode = countryCode.replace(/^\+/, '');

    const cleanedPhone = rest.cellPhone.replace(/\D/g, '');

    if (cleanedPhone.length === 11) {
      // Formata o telefone 
      const formattedPhone = cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

      // Concatena com o código do país
      const cellPhoneWithCountryCode = `+${countryCode} ${formattedPhone}`;

      // Atualiza o telefone no objeto e remove o countryCode
      const updatedUserData = {
        ...rest,
        cellPhone: cellPhoneWithCountryCode
      };

      this.userService.saveUserData(updatedUserData);
    } else {
      console.error('Número de telefone inválido.');
    }
  }

}