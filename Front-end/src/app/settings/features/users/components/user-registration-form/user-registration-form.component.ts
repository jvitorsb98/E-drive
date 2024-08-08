import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { User } from '../../../../core/models/User';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { MatDialog } from '@angular/material/dialog';
import { UserPasswordModalComponent } from '../user-password-modal/user-password-modal.component';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  formUser!: FormGroup;
  selectedCountryCode: string = '+55';
  countryCodeControl = new FormControl();
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
  }

  buildForm() {
    this.formUser = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birth: new FormControl(null, [Validators.required]),
      cellPhone: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.setMinAndMaxDate();
    this.buildForm();

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

        // Inicializa filteredCountries após definir countries
        this.filteredCountries = this.countryCodeControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterCountries(value))
        );
      },
      error: (error: any) => {
        console.error('Erro ao buscar dados da API:', error);
      }
    });

  }

  saveLocalStorage() {
    if (this.formUser.valid) {
      const formData = this.formUser.value;
      this.concatenateAndStoreUserData(formData);
      this.openModalPasswordUser();
      this.formUser.reset();
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
    this.selectedCountryCode = code;
    this.formUser.get('countryCode')?.setValue(code);
  }

  // Função para validar a data de nascimento do usuário
  private setMinAndMaxDate() {
    const date = new Date();
    this.minDate = new Date(date.getFullYear() - 100, 0, 1);
    this.maxDate = date;
  }

  getMask(): string {
    if (this.selectedCountryCode === '+55') {
      return '00 00000-0000';
    }
    return '00 00000-0000'; // Máscara padrão
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
    // Verifica se countryCode está presente antes de desestruturar
    const { countryCode, ...rest } = userData;

    // Concatena o código do país com o telefone
    const cleanedPhone = rest.cellPhone.replace(/\D/g, '');
    const cellPhoneWithCountryCode = `${countryCode} ${cleanedPhone}`;

    // Atualiza o telefone no objeto e remove o countryCode
    const updatedUserData = {
      ...rest,
      cellPhone: cellPhoneWithCountryCode
    };

    this.userService.saveUserData(updatedUserData);
  }
}
