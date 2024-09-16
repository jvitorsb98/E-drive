import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { ILoginRequest } from '../../../models/inter-Login';
import { ResetPasswordComponent } from '../recover-password/reset-password/reset-password.component';
import { Router } from '@angular/router';
import { FaqPopupComponent } from '../../../fragments/FAQ/faq-popup/faq-popup.component';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-login-modal',
  templateUrl: './user-login-modal.component.html',
  styleUrl: './user-login-modal.component.scss'
})
export class UserLoginModalComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private modal: ModalService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  modalResetPassword(): void {
    this.modal.openModal(ResetPasswordComponent);
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
    // TODO: uso de success com o swal this.showAlert('Bem vindo!', 'Login efetuado com sucesso!', true);
    this.router.navigate(['dashboard']);
    this.dialog.closeAll();
  }

  private handleLoginError(error: HttpErrorResponse): void {
    this.isLoading = false;

    this.showAlert('Erro de Autenticação', error.message);
    this.setFormErrors();
  }

  private setFormErrors(): void {
    this.loginForm.get('password')?.setErrors({ invalid: true });
    this.loginForm.get('email')?.setErrors({ invalid: true });
  }

  //TODO - Esse metodo pode ser flexível em uma classe de utilitarios ou em um servico, posivel mudança futura
  private showAlert(title: string = 'Erro', text: string = 'Algo deu errado', success: boolean = false): void {
    const icon = success ? 'success' : 'error';
    const popup = success ? 'custom-swal-popup-success' : 'custom-swal-popup-error';
    const confirmButton = success ? 'custom-swal-confirm-button-success' : 'custom-swal-confirm-button-error';

    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonText: 'Ok',
      customClass: {
        popup: popup,
        confirmButton: confirmButton
      }
    });
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
