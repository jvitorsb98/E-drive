// Angular Core
import { Component, OnInit } from '@angular/core';

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// RxJS
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

// Serviços e Modelos
import { User } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user/user.service';
import { CountryService } from '../../../../core/services/apis/country/country.service';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { Router } from '@angular/router';
import { noNumbersValidator } from '../../../../shared/validators/no-numbers.validator';
import { countryCodeValidator } from '../../../../shared/validators/country-code.validators';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {
  userForm!: FormGroup;// Formulário do usuário
  phoneType: string = 'MOBILE'; // Tipo de telefone (padrão: MOBILE)
  countries: any[] = []; // Lista de países
  filteredCountries!: Observable<any[]>; // Observable para países filtrados

  // Data mínima e máxima para o campo de data
  minDate: Date | null = null;
  maxDate: Date | null = null;

  /**
  * @param {UserService} userService - Serviço responsável por gerenciar as operações relacionadas aos usuários.
  * @param {CountryService} countryService - Serviço responsável por fornecer dados dos países.
  * @param {FormBuilder} formBuilder - Serviço para construir e configurar o formulário reativo.
  * @param {AlertasService} alertService - Serviço para exibir mensagens de alerta e notificações ao usuário.
  * @param {Router} router - Serviço de roteamento para navegar entre as páginas da aplicação.
  */
  constructor(
    private userService: UserService,
    private countryService: CountryService,
    private formBuilder: FormBuilder,
    private alertService: AlertasService,
    private router: Router
  ) { }

  /**
 * @description Inicializa o componente, definindo as configurações iniciais e carregando os dados necessários.
 *
 * @method setMinAndMaxDate Define a data mínima e máxima permitida para o campo de data.
 * @method loadCountries Carrega a lista de países a partir do serviço `CountryService`.
 * @method buildForm Inicializa o formulário reativo com a lista de países carregada.
 * @method loadUserData Carrega os dados do usuário para preencher o formulário, se disponíveis.
 */
  ngOnInit(): void {
    this.setMinAndMaxDate();
    this.buildForm();
    this.loadCountries();
    this.loadUserData();
  }

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
  * @description Cancela a edição do formulário e redireciona o usuário para a página de informações pessoais.
  * 
  * @method navigate Redireciona para o caminho `'e-driver/users/myinfo'`.
  */
  cancelEdit(): void {
    this.router.navigate(['e-driver/users/myinfo']);
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
   * @description Carrega a lista de países usando o serviço `CountryService`,
   *              transforma os dados de cada país para incluir o código do país e
   *              o nome, e configura um filtro reativo para o campo `countryCode`.
   *              Este filtro permite ao usuário buscar e selecionar o código do país
   *              de forma dinâmica com base no valor digitado.
   * 
   * @param {CountryService} countryService - Serviço responsável por obter a lista de países.
   *  @param {any[]} data - Lista de objetos representando os países obtidos através do serviço `CountryService`.
   */
  private loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data.map((country: any) => {
          const idd = country.idd || {};
          const code = (idd.root || '') + (idd.suffixes?.[0] || '');

          return {
            name: country.name?.common || 'Unknown',
            code: code
          };
        });

        // Aplica o validador personalizado agora que `countries` está carregado
        this.userForm.setValidators(countryCodeValidator(this.countries));

        // Configura o filtro reativo para `countryCode`
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
 * @description Filtra a lista de países com base no valor fornecido, realizando a busca tanto pelo nome quanto pelo código do país.
 * 
 * @param value O valor de pesquisa inserido pelo usuário para filtrar os países.
 * 
 * @returns Um array de países filtrados que contêm o valor de pesquisa no nome ou código.
 */
  private filterCountries(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue) ||
      country.code.toLowerCase().includes(filterValue)
    );
  }

  /**
 * @description Carrega os dados do usuário autenticado e preenche o formulário com essas informações.
 * 
 * O método obtém os detalhes do usuário autenticado, processa a data de nascimento para ajustar o fuso horário e 
 * preenche os campos do formulário com o nome, email, data de nascimento, telefone (sem o código do país) 
 * e o código do país extraído do número de telefone.
 * 
 * @returns void
 */
  private loadUserData(): void {
    this.userService.getAuthenticatedUserDetails().subscribe({
      next: (user: User) => {
        const birthDate = new Date(user.birth!);
        const userBirthDate = new Date(birthDate.getTime() + birthDate.getTimezoneOffset() * 60000);

        // Preenche o formulário com os dados do usuário
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          birth: userBirthDate,
          cellPhone: user.cellPhone.replace(/^\+\d{1,3} /, ''), // Remove o código do país para exibição
          countryCode: '+' + user.cellPhone.split(' ')[0].replace(/^\+/, '').slice(0, 2) // Extrai o código do país
        });
      },
    });
  }

  /**
 * @description Atualiza os dados do usuário autenticado com base nas informações do formulário.
 * 
 * O método verifica se o formulário é válido, formata o número de telefone (com o código do país) 
 * antes de enviá-lo ao servidor, e faz a requisição para atualizar os dados do usuário. 
 * Se a atualização for bem-sucedida, uma mensagem de sucesso é exibida e, caso o usuário confirme, 
 * ele é redirecionado para a página de informações do usuário.
 * Em caso de erro, uma mensagem de erro é exibida.
 * 
 * @returns void
 */
  updateUser(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;

      // Formata o número de telefone antes de enviá-lo para o servidor
      userData.cellPhone = this.formatPhoneNumber(userData.countryCode, userData.cellPhone);

      this.userService.update(userData).subscribe({
        next: () => {
          this.alertService.showSuccess('Atualização bem-sucedida!', 'Os dados do usuário foram atualizados com sucesso.').then((result) => {
            if (result) {
              this.cancelEdit();
            }
          })
        },
        error: (err) => {
          this.alertService.showError('Erro ao atualizar usuário', err.message);
        }
      });
    }
  }

  /**
  * @description Formata o número de telefone com o código do país e aplica a máscara de telefone.
  * 
  * Este método recebe um código de país e um número de telefone, remove quaisquer caracteres não numéricos 
  * do número de telefone e então o formata de acordo com o padrão: 
  * (XX) XXXXX-XXXX, onde XX é o código de área e o restante do número segue o formato usual de telefone.
  * 
  * @param {string} countryCode - O código do país a ser prefixado ao número de telefone.
  * @param {string} phoneNumber - O número de telefone que será formatado.
  * 
  * @returns {string} O número de telefone formatado com o código do país.
  */
  private formatPhoneNumber(countryCode: string, phoneNumber: string): string {
    // Remove caracteres não numéricos do número de telefone
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Adiciona o código do país e formata o número
    return `${countryCode} (${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.slice(2, 7)}-${cleanedPhoneNumber.slice(7)}`;
  }
}