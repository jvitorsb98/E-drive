// Angular Core
import { Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2 } from '@angular/core';

// Angular Forms
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

// RxJS
import { filter, take } from 'rxjs';

// Serviços e Modelos
import { UserService } from '../../../../core/services/user/user.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { User } from '../../../../core/models/user';

// Componentes
import { UserLoginModalComponent } from '../../../../core/security/login/user-login-modal/user-login-modal.component';

// Validators
import { passwordMatchValidator } from '../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../shared/validators/password-field.validator';

// Angular Router
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IResetPasswordRequest } from '../../../../core/models/inter-Login';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { LgpdModalComponent } from '../../../../shared/components/lgpd-modal/lgpd-modal.component';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent implements OnInit {
  @Input() title: string = 'Criar sua senha'; // valores padrão
  @Input() subtitle: string = 'Escolha uma senha forte para proteger sua conta.'; // valores padrão
  @Input() btnText: string = 'Finalizar cadastro'; // valores padrão
  @Input() isPasswordChange: boolean = false;

  userPassword!: FormGroup;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private routerActivator: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertasService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private userData: User,
    public dialogRef: MatDialogRef<UserPasswordModalComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);

    // Obtem os valores passados na rota
    this.routerActivator.queryParams.subscribe(
      (params) => {
        this.title = params['title'] || this.title; // Usa o valor passado ou o valor padrão
        this.subtitle = params['subtitle'] || this.subtitle;
        this.btnText = params['btnText'] || this.btnText;
        this.isPasswordChange = params['isPasswordChange'] === 'true'; // conversão de string para boolean
      }
    )
  }

  // Cria e inicializa o formulário com validação de senha e confirmação de senha.
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      newsletter: new FormControl(false, Validators.requiredTrue)
    }, { validators: passwordMatchValidator });
  }

  // função para direcionar se é para trocar a senha ou criar um usuário
  saveUser(): void {
    if (this.isPasswordChange) {
      this.changePassword();
    } else {
      this.createUser();
    }
  }

  // Função para criar um usuário
  createUser() {
    if (this.userPassword.valid) {
      this.userData.password = this.userPassword.value.password;

      this.userService.register(this.userData).subscribe({
        next: (response) => {
          this.userPassword.reset();
          this.closeModal();
          this.alertService.showSuccess('Cadastro bem-sucedido!', `${this.userData.name} cadastrado(a) com sucesso. Um email de ativação foi enviado.`)
            .then((result) => {
              if (result) {
                // Primeiro inscreva-se no evento de navegação para abrir o modal
                this.router.events.pipe(
                  filter(event => event instanceof NavigationEnd),
                  take(1) // Certifica-se de que o evento de navegação seja emitido apenas uma vez para evitar vazamentos de memória.
                ).subscribe(() => {
                  // Abre o modal após a navegação
                  this.router.navigate(['e-driver/login'])
                });
                // Depois navega para a página de introdução
                this.router.navigate(['e-driver/intro-page']);
              }
            });
        },
        error: (e) => {
          this.alertService.showError(e.error)
        }
      });
    }
  }

  // função para troca de senha
  //NOTE - Acho que esse metodo não esta sendo usado
  changePassword(): void {
    if (this.userPassword.valid) {
      //NOTE - fiz essa alteração para usar a IResetPasswordRequest que não estava sendo usada
      const request: IResetPasswordRequest = {
        password: this.userPassword.value.password,
        token: this.auth.getTokenReset()!
      }
      if (request.token) {
        this.auth.resetPassword(request).subscribe({
          next: (response) => {
            this.alertService.showSuccess('sucesso !!', `Sua senha foi alterada com sucesso. `).then((result) => {
              if (result) {
                this.closeModal();
                this.router.navigate(['/login']);
              }
            })
          },
          error: (e) => {
            this.alertService.showError('Erro !!', `Houve um problema ao alterar sua senha. Tente novamente mais tarde.`)
          }
        });
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onFormClick(event: Event) {
    // Verifica se as senhas foram preenchidas
    const password = this.userPassword.get('password')?.value;
    const confirmPassword = this.userPassword.get('confirmPassword')?.value;

    if (password && confirmPassword) {
      // Verifica se o clique foi dentro do formulário
      const target = event.target as HTMLElement;
      const formElement = document.querySelector('.container-fluid');
      if (formElement && formElement.contains(target)) {
        this.validateForm();
      }
    }
  }

  validateForm() {
    if (this.userPassword.get('newsletter')?.invalid) {
      this.userPassword.get('newsletter')?.markAsTouched();
    }
  }

  // Abre o modal de LGPD
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

    this.dialog.open(LgpdModalComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
      data: { lgpds: lgpdFaqs } // Passa os FAQs relacionados à LGPD
    }).afterClosed().subscribe(result => {
      if (result) {
        this.userPassword.get('newsletter')?.setValue(true);
      } else {
        this.userPassword.get('newsletter')?.setValue(false);
      }
    });

  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
