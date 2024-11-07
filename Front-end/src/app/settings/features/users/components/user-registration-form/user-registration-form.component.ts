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
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';

// Componentes
import { UserPasswordModalComponent } from '../user-password-modal/user-password-modal.component';

// Validators
import { countryCodeValidator } from '../../../../shared/validators/country-code.validators';
import { noNumbersValidator } from '../../../../shared/validators/no-numbers.validator';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent {

  user!: User; // Objeto que representa o usuário atual
  userForm!: FormGroup; // Formulário do usuário
  phoneType: string = 'MOBILE'; // Tipo de telefone (MOBILE por padrão)
  countries: any[] = []; // Lista de países disponíveis
  filteredCountries!: Observable<any[]>; // Observable para filtrar países
  minDate: Date | null = null; // Data mínima permitida para nascimento
  maxDate: Date | null = null; // Data máxima permitida para nascimento

  /**
 * @description Inicializa o serviço de dados do usuário, o serviço de países, o diálogo para modais,
 *               o roteador e o construtor de formulários. Também chama o método buildForm para configurar
 *               o formulário inicial do componente.
 * @param {UserDataService} userDataService - Serviço responsável pela manipulação dos dados do usuário.
 * @param {CountryService} countryService - Serviço para obtenção e manipulação de dados de países.
 * @param {MatDialog} dialog - Serviço utilizado para abrir diálogos modais.
 * @param {Router} router - Serviço para navegação de rotas no aplicativo.
 * @param {FormBuilder} formBuilder - Serviço para criação e manipulação de formulários reativos.
 */
  constructor(
    private userDataService: UserDataService,
    private countryService: CountryService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  /**
 * @description Inicializa o formulário do usuário com os campos necessários e aplica validações específicas.
 *               Se uma lista de países for passada, um validador personalizado para o código do país é adicionado.
 * @param {{ code: string }[]} _countries - Lista opcional de objetos representando países, usada para validar
 *               o código do país. Cada objeto deve conter uma propriedade `code` com o código do país.
 */
  buildForm(_countries: { code: string }[] = []) {
    this.userForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(2), noNumbersValidator]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birth: new FormControl(null, Validators.required),
      cellPhone: new FormControl(null, Validators.required),
      countryCode: new FormControl(null, Validators.required)
    });

    // Adiciona um validador personalizado se uma lista de países for fornecida
    if (_countries.length > 0) {
      this.userForm.setValidators(countryCodeValidator(_countries));
      // @ Validador personalizado para `countryCode`, com base na lista de países fornecida
    }
  }

  /**
 * @description Inicializa o componente ao configurar as datas mínima e máxima para o campo de data de nascimento e 
 *               obter uma lista de países da API. Após receber os dados de países, o formulário do usuário é inicializado 
 *               com a lista e o campo `countryCode` é configurado para filtrar os países em tempo real conforme o usuário digita.
 * 
 * @param {CountryService} countryService - Serviço que busca e fornece dados de países.
 * @returns {void}
 */
  ngOnInit() {
    this.setMinAndMaxDate(); // Define as datas mínima e máxima para o campo de data de nascimento
    this.loadCountries()
    this.buildForm(this.countries); // Inicializa o formulário com a lista de países
  }

  /**
 * @description Verifica se o formulário do usuário é válido. Se válido, 
 *               cria um objeto `user` com os dados do formulário, formata e armazena o número de celular 
 *               e, em seguida, abre o modal para a etapa de senha.
 * 
 * @returns {void}
 */
  continueToPasswordStep() {
    if (this.userForm.valid) {
      this.user = { ...this.userForm.value }; // Cria um objeto `user` a partir dos valores do formulário
      this.user.cellPhone = this.userDataService.formatAndStoreUserData(
        this.userForm.get('countryCode')!.value,
        this.userForm.get('cellPhone')!.value
      ); // Formata e armazena o número de celular com o código do país

      this.openModalPasswordUser(); // Abre o modal para a etapa de senha
    }
  }

  /**
  * @description Carrega a lista de países usando o serviço `CountryService`,
  *              transforma os dados de cada país para incluir o código do país e
  *              o nome, e configura um filtro reativo para o campo `countryCode`.
  *              Este filtro permite ao usuário buscar e selecionar o código do país
  *              de forma dinâmica com base no valor digitado.
  * 
  * @param {CountryService} countryService - Serviço responsável por obter a lista de países.
  * @param {FormGroup} userForm - Formulário Angular onde o campo `countryCode` será filtrado.
  *  @param {any[]} data - Lista de objetos representando os países obtidos através do serviço `CountryService`.
  */
  private loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        // Mapeia cada país para extrair o nome e o código do país
        this.countries = data.map((country: any) => {
          const idd = country.idd || {};
          const code = (idd.root || '') + (idd.suffixes?.[0] || '');

          return {
            name: country.name?.common || 'Unknown',
            code: code
          };
        });

        // Inicializa o formulário com a lista de países
        this.buildForm(this.countries);

        // Configura o filtro reativo para `countryCode` baseado no valor digitado
        this.filteredCountries = this.userForm.get('countryCode')!.valueChanges.pipe(
          startWith(''),
          distinctUntilChanged(),
          map(value => this.filterCountries(value || ''))
        );
      },
      error: (err) => {
        console.error('Erro ao carregar países:', err);
      }
    });
  }

  /**
 * @description Filtra a lista de países com base no valor de entrada fornecido.
 *               Retorna um array de países que contêm o valor de entrada no nome ou no código.
 * 
 * @param {string} value - Valor de entrada para filtrar os países.
 * @returns {any[]} - Array filtrado de países.
 */
  private filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase(); // Converte o valor de entrada para minúsculas
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue) || // Verifica se o nome do país inclui o valor de entrada
      country.code.toLowerCase().includes(filterValue)   // Verifica se o código do país inclui o valor de entrada
    );
  }

  /**
  * @description Atualiza o campo `countryCode` do formulário do usuário 
  *               com o código do país correspondente ao código fornecido.
  * 
  * @param {string} code - Código do país selecionado.
  * @returns {void}
  */
  onCountryChange(code: string) {
    const country = this.countries.find(c => c.code === code); // Busca o país pelo código fornecido
    if (country) {
      this.userForm.get('countryCode')?.setValue(country.code); // Atualiza o campo `countryCode` no formulário
    }
  }

  /**
 * @description Define as datas mínima e máxima para o campo de data de nascimento.
 *               A data mínima é fixada para 100 anos atrás e a data máxima para 10 anos atrás.
 * 
 * @returns {void}
 */
  private setMinAndMaxDate() {
    const date = new Date(); // Obtém a data atual
    this.minDate = new Date(date.getFullYear() - 100, 0, 1); // Define a data mínima para 100 anos atrás
    this.maxDate = new Date(date.getFullYear() - 13, date.getMonth(), date.getDate()); // Define a data máxima para exatamente 10 anos atrás
  }

  /**
  * @description Abre um modal para que o usuário insira a senha, 
  *               passando os dados do usuário como informações.
  * 
  * @returns {void}
  */
  private openModalPasswordUser() {
    this.dialog.open(UserPasswordModalComponent, { // Abre o modal com o componente especificado
      width: '450px', // Define a largura do modal
      height: '485px', // Define a altura do modal
      data: this.user // Passa os dados do usuário para o modal
    });
  }

  /**
   * @description Redireciona o usuário de volta para a página inicial.
   * 
   * @returns {void}
   */
  goBack() {
    this.router.navigate(['/']); // Navega para a rota da página inicial
  }

}
