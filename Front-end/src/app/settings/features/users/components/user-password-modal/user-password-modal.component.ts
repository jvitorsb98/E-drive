// Angular Core
import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// RxJS
import { filter, take } from 'rxjs';

// Serviços e Modelos
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/user';

// Componentes
import { LgpdModalComponent } from '../../../../shared/components/lgpd-modal/lgpd-modal.component';

// Validators
import { passwordMatchValidator } from '../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../shared/validators/password-field.validator';

// Angular Router
import { NavigationEnd, Router } from '@angular/router';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent implements OnInit {
  userPassword!: FormGroup; // Formulário de senha do usuário

  /**
  * @description Construtor do componente UserPasswordModalComponent.
  * Injeta os serviços necessários para manipular dados do usuário, navegação, construção de formulários,
  * renderização dinâmica, exibição de alertas e controle de diálogos modais.
  *
  * @param userService Serviço responsável por manipular os dados dos usuários.
  * @param router Serviço de roteamento Angular para navegação entre páginas.
  * @param formBuilder Serviço para construir formulários reativos.
  * @param renderer Serviço para manipular o DOM de forma segura.
  * @param el ElementRef para acessar o elemento DOM nativo do componente.
  * @param alertService Serviço para exibir alertas personalizados.
  * @param dialog Serviço de diálogo para abrir janelas modais no aplicativo.
  * @param userData Dados do usuário passados ao abrir o modal.
  * @param dialogRef Referência ao diálogo modal aberto para controle de sua instância.
  */
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertasService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private userData: User,
    public dialogRef: MatDialogRef<UserPasswordModalComponent>,
  ) { }

  /**
 * @description Inicializa o componente, configurando o formulário e inicializando o validador de campo de senha.
 */
  ngOnInit() {
    this.buildForm();
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);
  }

  /**
   * @description Cria e inicializa o formulário com os campos de senha, confirmação de senha e consentimento para newsletter,
   * aplicando validações de senha e confirmação.
   */
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, Validators.required),
      newsletter: new FormControl(false, Validators.requiredTrue)
    }, { validators: passwordMatchValidator });
  }

  /**
   * @description Verifica se o formulário está válido e, em caso positivo, chama o método `createUser` para cadastrar o usuário.
   * Caso contrário, marca todos os campos como "touched" para exibir mensagens de erro.
   */
  saveUser(): void {
    if (this.userPassword && this.userPassword.valid) {
      this.createUser();
    } else {
      this.userPassword.markAllAsTouched();
    }
  }

  /**
   * @description Função para cadastrar um novo usuário. Se o formulário estiver válido, os dados de senha são salvos,
   * e o serviço de registro de usuário é chamado. Ao final, um modal de confirmação é exibido e, após confirmação,
   * o usuário é redirecionado para a página de login.
   *
   * @returns void
   */
  createUser(): void {
    if (this.userPassword.valid) {
      this.userData.password = this.userPassword.value.password;

      this.userService.register(this.userData).subscribe({
        next: () => {
          this.userPassword.reset();
          this.closeModal();
          this.alertService.showSuccess('Cadastro bem-sucedido!', `${this.userData.name} cadastrado(a) com sucesso. Um email de ativação foi enviado.`)
            .then((result) => {
              if (result) {
                this.router.events.pipe(
                  filter(event => event instanceof NavigationEnd),
                  take(1)
                ).subscribe(() => {
                  this.router.navigate(['e-driver/login']);
                });
                this.router.navigate(['e-driver/intro-page']);
              }
            });
        },
        error: (e) => {
          this.alertService.showError(e.error);
        }
      });
    }
  }

  /**
 * @description Abre o modal da LGPD (Lei Geral de Proteção de Dados) com perguntas frequentes relacionadas aos direitos
 * e consentimento de dados do usuário. O modal é aberto somente se o controle de 'newsletter' for inválido.
 * Após o fechamento do modal, o valor de 'newsletter' é atualizado com base na resposta do usuário.
 *
 * @param lgpdFaqs {Array} - Lista de perguntas e respostas sobre a LGPD a serem exibidas no modal.
 */
  openLGPDModal() {
    // Verifica se o controle 'newsletter' é inválido e não abre o modal
    if (!this.userPassword.get('newsletter')?.invalid) {
      return;
    }

    const lgpdFaqs = [
      {
        question: 'O que é a LGPD?',
        answer: 'A LGPD é a Lei Geral de Proteção de Dados, que regulamenta o tratamento de dados pessoais por empresas e organizações no Brasil.'
      },
      {
        question: 'Quais são os meus direitos sob a LGPD?',
        answer: 'Você tem o direito de acessar, corrigir, excluir e solicitar a portabilidade dos seus dados, além de ser informado sobre o uso deles.'
      },
      {
        question: 'Como meus dados serão utilizados?',
        answer: 'Seus dados serão usados para garantir o funcionamento dos nossos serviços e melhorar a sua experiência, sempre respeitando os princípios da LGPD.'
      },
      {
        question: 'Posso revogar meu consentimento?',
        answer: 'Sim, você pode revogar seu consentimento a qualquer momento entrando em contato conosco através dos nossos canais de atendimento.'
      }
    ];

    // Abre o modal do LGPD com configurações de tamanho e dados
    const dialogRef = this.dialog.open(LgpdModalComponent, {
      width: '600px', // Largura do modal
      height: '562px', // Altura do modal
      disableClose: true, // Impede que o modal seja fechado ao clicar fora dele
      data: { lgpds: lgpdFaqs } // Passa os FAQs relacionados à LGPD
    });

    /**
     * @description Método para ajustar a rolagem do modal após sua abertura.
     * Esse método garante que, ao abrir o modal, a rolagem do conteúdo seja ajustada para o topo.
     * O setTimeout com 0 milissegundos é usado para garantir que o código seja executado após a renderização completa do modal.
     * Isso faz com que a rolagem seja ajustada somente após o DOM ser atualizado, evitando problemas de renderização de conteúdo.
     * 
     * @function afterOpened
     * @param {void}
     * @returns {void}
     */
    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        // Seleciona o contêiner do modal para aplicar a rolagem
        const container = document.querySelector('.mat-dialog-container') as HTMLElement;

        // Se o contêiner foi encontrado, ajusta a posição da rolagem para o topo
        if (container) {
          // Garante que a rolagem do modal comece no topo (scrollTop = 0)
          container.scrollTop = 0;
        }
      });
    });

    /**
     * @description Método que executa uma ação quando o modal é fechado.
     * Após o fechamento do modal, verifica o resultado (se o usuário aceitou os termos) e atualiza o controle 'newsletter'.
     * Caso o usuário tenha aceitado, o valor do controle será alterado para verdadeiro, caso contrário, será falso.
     * 
     * @function afterClosed
     * @param {boolean} result - Resultado do modal, indicando se o usuário aceitou os termos.
     * @returns {void}
     */
    dialogRef.afterClosed().subscribe(result => {
      // Se o usuário aceitou os termos, define o valor do controle 'newsletter' como verdadeiro
      if (result) {
        this.userPassword.get('newsletter')?.setValue(true);
      } else {
        // Caso contrário, define o valor como falso
        this.userPassword.get('newsletter')?.setValue(false);
      }
    });

  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
