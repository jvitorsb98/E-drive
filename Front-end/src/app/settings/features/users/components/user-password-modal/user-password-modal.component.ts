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
  userPassword!: FormGroup;

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

  ngOnInit() {
    this.buildForm();
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);
  }

  // Cria e inicializa o formulário com validação de senha e confirmação de senha.
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      newsletter: new FormControl(false, Validators.requiredTrue)
    }, { validators: passwordMatchValidator });
  }

  saveUser(): void {
    // Verifica se o formulário existe e se está válido
    if (this.userPassword && this.userPassword.valid) {
      this.createUser();
    } else {
      // Caso o formulário não esteja válido, marqua todos os campos como 'touched' para mostrar mensagens de erro
      this.userPassword.markAllAsTouched();
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
