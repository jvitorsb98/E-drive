import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { passwordMatchValidator } from '../../../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../../../shared/validators/password-field.validator';
import { IResetPasswordRequest } from '../../../../../models/inter-Login';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  token!: string; // Token que será passado via URL

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertasService: AlertasService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);

    this.token = this.route.snapshot.queryParams['token'] || '';
    console.log("token aqui: ",this.token);
    // Verifica se o token é valido
    if (!this.token) {
      this.alertasService.showError('Erro', 'Token inválido. Por favor, tente novamente.').then(() => {
        this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
      });
    }

    // Inicializa o formulário
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
    }, { validators: passwordMatchValidator });
  }

  // Envia a nova senha
  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const request: IResetPasswordRequest = {
        password: this.resetPasswordForm.get('password')?.value,
        token: this.token
      }
      // Chama o serviço para redefinir a senha
      this.authService.resetPassword(request).subscribe({
        next: (response) => {
          this.alertasService.showSuccess('Redefinição de senha', response).then(() => {
            this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
          });
        },
        error: (error: HttpErrorResponse) => {
          this.alertasService.showError('Redefinição de senha', error.error).then(() => {
            this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
          });
        }
      });
    }
  }

  close(): void {
    this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
  }
}
