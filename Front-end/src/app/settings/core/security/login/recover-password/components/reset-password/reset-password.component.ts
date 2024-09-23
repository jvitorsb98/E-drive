import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../services/auth/auth.service';
import { passwordMatchValidator } from '../../../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../../../shared/validators/password-field.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { IResetPasswordRequest } from '../../../../../models/inter-Login';

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
      this.showAlert('Erro', 'Token inválido. Por favor, tente novamente.');
      this.router.navigate(['/login']);
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
        next: () => {
          this.showAlert('Sucesso', 'Sua senha foi redefinida com sucesso!', true);
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.showAlert('Erro', error.message);
        }
      });
    }
  }

  close(): void {
    this.router.navigate(['/login']);
  }

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
}
