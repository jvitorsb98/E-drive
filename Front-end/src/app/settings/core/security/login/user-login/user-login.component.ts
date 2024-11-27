import { AlertasService } from '../../../services/Alertas/alertas.service';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';
import { AuthService } from '../../services/auth/auth.service';
import { ILoginRequest } from '../../../models/inter-Login';
import { ModalRecoverPasswordComponent } from '../recover-password/components/modal-recover-password/modal-recover-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqPopupComponent } from '../../../fragments/faq-popup/faq-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordVisibilityToggle } from '../../../../shared/validators/password-visibility-toggle';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  userProfileImage = 'assets/images/DALL·E 2024-10-17.jpeg';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private modal: ModalService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertasService: AlertasService
  ) { }

  ngOnInit(): void {
    this.initLoginForm();

    // Captura os parâmetros 'success' ou 'error' da URL diretamente
    this.activatedRoute.queryParams.subscribe(params => {
      const successMessage = params['success'];
      const errorMessage = params['error'];

      if (successMessage) {
        this.alertasService.showSuccess('Sucesso', successMessage, 'OK');
      }

      if (errorMessage) {
        this.alertasService.showError('Erro', errorMessage, 'OK');
      }
    });
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    PasswordVisibilityToggle.togglePasswordVisibility(this.renderer, this.el);

    // Remove erros quando os campos são corrigidos
    this.loginForm.valueChanges.subscribe(() => {
      this.loginForm.get('email')?.setErrors(null);
      this.loginForm.get('password')?.setErrors(null);
    });
  }

  modalResetPassword(isPasswordRecovery: boolean): void {
    this.modal.openModal(ModalRecoverPasswordComponent, {
      email: this.loginForm.get('email')?.value,
      isPasswordRecovery: isPasswordRecovery
    }, {
      width: '500px',
      height: '232px',
      disableClose: true
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const loginRequest: ILoginRequest = this.buildLoginRequest();

    this.auth.login(loginRequest).subscribe({
      next: () => this.handleLoginSuccess(),
      error: (error: HttpErrorResponse) => this.handleLoginError(error)
    });
  }

  private buildLoginRequest(): ILoginRequest {
    return {
      login: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
  }

  private handleLoginSuccess(): void {
    this.isLoading = false;
    this.router.navigate(['e-driver/dashboard']);
    this.dialog.closeAll();
  }

  private handleLoginError(error: HttpErrorResponse): void {
    console.log(error);
    this.isLoading = false;
    this.alertasService.showError('Erro de Autenticação', error.message);
    this.setFormErrors();
  }

  private setFormErrors(): void {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    emailControl?.setErrors({ invalid: true });
    passwordControl?.setErrors({ invalid: true });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  openFAQModal(): void {
    const faqData = [
      {
        question: 'Como posso redefinir minha senha se a esqueci?',
        answer: 'Clique em "Esqueceu a senha?" para iniciar o processo de redefinição. Um e-mail com as instruções será enviado para que você possa criar uma nova senha com segurança.'
      },
      {
        question: 'Ainda não possui uma conta na plataforma?',
        answer: 'Para ter acesso completo, cadastre-se clicando em "Cadastre-se". Preencha os dados solicitados e comece a usar nossos serviços.'
      },
      {
        question: 'Quais são os requisitos para uma senha segura?',
        answer: 'Para proteger sua conta, sua senha deve atender aos seguintes requisitos mínimos:\n' +
                '- Ter pelo menos 6 caracteres;\n' +
                '- Incluir ao menos 1 número;\n' +
                '- Conter 1 letra minúscula e 1 letra maiúscula;\n' +
                '- Incluir ao menos 1 símbolo especial (ex.: @, #, $, etc.).\n' +
                'Esses critérios ajudam a manter sua conta mais segura contra acessos não autorizados.'
      },
      {
        question: 'Por que preciso confirmar meu e-mail ao me cadastrar?',
        answer: 'A confirmação do e-mail é uma etapa de segurança para garantir que você é o proprietário do endereço fornecido. Após o cadastro, um link de confirmação será enviado ao seu e-mail.'
      },
      {
        question: 'O que devo fazer se digitar e-mail ou senha incorretos?',
        answer: 'Se o e-mail ou senha estiverem incorretos, mensagens de erro específicas serão exibidas para orientá-lo. Revise as informações e tente novamente.'
      }
    ];

    this.dialog.open(FaqPopupComponent, { data: { faqs: faqData } });
  }
}
