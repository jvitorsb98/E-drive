// Angular Core
import { Component, OnInit } from '@angular/core';

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// RxJS
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Serviços e Modelos
import { User } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  // Variável para controlar o modo de edição
  isEditing: boolean = false;

  // Formulário do usuário
  userForm!: FormGroup;

  // Tipo de telefone (padrão: MOBILE)
  phoneType: string = 'MOBILE';

  // Lista de países
  countries: any[] = [];

  // Observable para países filtrados
  filteredCountries!: Observable<any[]>;

  // Data mínima e máxima para o campo de data
  minDate: Date | null = null;
  maxDate: Date | null = null;

  // Injeção de dependências para serviços e construtor
  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private formBuilder: FormBuilder,
    private alertService: AlertasService
  ) { }

  // Método chamado ao inicializar o componente
  ngOnInit(): void {
    this.buildForm(); // Constrói o formulário
    this.setMinAndMaxDate(); // Define a data mínima e máxima para o campo de data
    this.loadCountries(); // Carrega a lista de países
    this.loadUserData(); // Carrega os dados do usuário
  }

  // Constrói o formulário do usuário com validação
  private buildForm(): void {
    this.userForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birth: new FormControl(null, Validators.required),
      cellPhone: new FormControl(null, Validators.required),
      countryCode: new FormControl(null, Validators.required)
    });
  }

  // Ativa o modo de edição e habilita o formulário
  isButtonVisible = true;
  editData() {
    this.isEditing = true;
    this.userForm.enable();
    this.isButtonVisible = false;
  }

  // Cancela a edição, desativa o formulário e recarrega os dados do usuário
  cancelEdit() {
    this.isEditing = false;
    this.userForm.disable();
    this.loadUserData(); // Recarrega os dados originais do usuário
    this.isButtonVisible = true;
  }

  // Define as datas mínima e máxima para o campo de data
  private setMinAndMaxDate(): void {
    const date = new Date();
    this.minDate = new Date(date.getFullYear() - 100, 0, 1); // Data mínima: 100 anos atrás
    this.maxDate = date; // Data máxima: data atual
  }

  // Carrega a lista de países da API
  private loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        // Mapeia os dados dos países para o formato necessário
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

        // Configura o observable para filtrar países com base na entrada do usuário
        this.filteredCountries = this.userForm.get('countryCode')!.valueChanges.pipe(
          startWith(''),
          map(value => this.filterCountries(value))
        );
      },
      error: (err) => {
        console.error('Erro ao carregar países', err);
      }
    });
  }

  // Filtra a lista de países com base na string de pesquisa
  private filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  // Carrega os dados do usuário autenticado e preenche o formulário
  private loadUserData(): void {
    this.userService.getAuthenticatedUserDetails().subscribe({
      next: (user: User) => {
        // Preenche o formulário com os dados do usuário
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          birth: user.birth,
          cellPhone: user.cellPhone.replace(/^\+\d{1,3} /, ''), // Remove o código do país para exibição
          countryCode: user.cellPhone.split(' ')[0].replace(/^\+/, '').slice(0, 2) // Extrai o código do país
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário', err);
      }
    });
  }

  // Atualiza os dados do usuário no servidor
  updateUser(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;

      // Formata o número de telefone antes de enviá-lo para o servidor
      userData.cellPhone = this.formatPhoneNumber(userData.countryCode, userData.cellPhone);

      this.userService.update(userData).subscribe({
        next: () => {
          console.log('Usuário atualizado com sucesso');
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário', err);
        }
      });

    this.isButtonVisible = true;
    }

  }

  // Função para formatar o número de telefone
  private formatPhoneNumber(countryCode: string, phoneNumber: string): string {
    // Remove caracteres não numéricos do número de telefone
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Adiciona o código do país e formata o número
    return `+${countryCode} (${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.slice(2, 7)}-${cleanedPhoneNumber.slice(7)}`;
  }

  // Método para excluir a conta do usuário (implementação futura)
  deleteAccount() {
    this.alertService.showWarning('Desativar conta do usuário', "Deseja realmente desativar a sua conta '" + this.userService.getUserEmail() +"' ?", 'Desativar' ,'Cancelar').then((result) => {
      if (result) {
        const id = this.userService.getUserID() || 0;
        this.userService.deactivate(id).subscribe({
          next: () => {
            this.alertService.showSuccess('Conta desativada com sucesso', 'Agora você pode criar novas contas.');
            this.onLogout();
          },
          error: (err) => {
            this.alertService.showError('Erro ao desativar a conta', err.message);
          }
        })
      }
    });
  }

  onLogout(): void {
    this.userService.logout();
  }

}
