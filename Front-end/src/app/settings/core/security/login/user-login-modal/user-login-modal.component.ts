import { AlertasService } from './../../../services/Alertas/alertas.service';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { ILoginRequest } from '../../../models/inter-Login';
import { ModalRecoverPasswordComponent } from '../../login/recover-password/components/modal-recover-password/modal-recover-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqPopupComponent } from '../../../fragments/faq-popup/faq-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordVisibilityToggle } from '../../../../shared/validators/password-visibility-toggle';

@Component({
  selector: 'app-user-login-modal',
  templateUrl: './user-login-modal.component.html',
  styleUrl: './user-login-modal.component.scss'
})
export class UserLoginModalComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  //TODO - remoção de opção de login com imagem
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
  }

  modalResetPassword(isPasswordRecovery: boolean): void {
    this.modal.openModal(ModalRecoverPasswordComponent, {
      email: this.loginForm.get('email')?.value,
      isPasswordRecovery: isPasswordRecovery
    }, {
      width: '500px',
      height: '223px',
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
    console.log(error)
    this.isLoading = false;
    this.alertasService.showError('Erro de Autenticação', error.message);
    this.setFormErrors();
  }

  private setFormErrors(): void {
    this.loginForm.get('password')?.setErrors({ invalid: true });
    this.loginForm.get('email')?.setErrors({ invalid: true });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  openFAQModal(): void {
    const faqData = [
      {
        question: 'Como faço para redefinir minha senha?',
        answer: 'Para redefinir sua senha, clique no link "Esqueceu a senha?".'
      },
      {
        question: 'Ainda não tenho uma conta, como faço para me cadastrar?',
        answer: 'Para se cadastrar, clique no botão "Cadastre-se".'
      },
      {
        question: 'Quais são os requisitos para a senha?',
        answer: 'A senha deve ter pelo menos 6 caracteres.'
      },
      {
        question: 'Preciso confirmar meu e-mail após o cadastro?',
        answer: 'Essa informação não está disponível na página. Consulte a documentação ou entre em contato com o suporte para mais detalhes.'
      },
      {
        question: 'O que acontece se eu digitar meu e-mail ou senha incorretamente?',
        answer: 'A página exibirá mensagens de erro indicando se o e-mail é inválido ou se a senha está incorreta.'
      }
    ];

    this.dialog.open(FaqPopupComponent, { data: { faqs: faqData } });
  }
}
