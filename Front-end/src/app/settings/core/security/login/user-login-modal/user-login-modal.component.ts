import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { ILoginRequest } from '../../../models/inter-Login';
import { ResetPasswordComponent } from '../recover-password/reset-password/reset-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-modal',
  templateUrl: './user-login-modal.component.html',
  styleUrl: './user-login-modal.component.scss'
})
export class UserLoginModalComponent {
  loginForm !: FormGroup;
  loginRequest!: ILoginRequest;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private modal: ModalService,
    private auth: AuthService,
    private router: Router
  ) { }

  /* Chama o modal de-esquecimento de senha */
  modalResetPassword() {
    this.modal.openModal(ResetPasswordComponent)
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  goBack() {
    // this.dialog.closeAll();
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    this.loginRequest = {
      login: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.auth.login(this.loginRequest).subscribe({
      next: () => {
        this.isLoading = false;
        // redirecionar para a rota home/dashboard
        this.router.navigate(['deshboard']);
        // fechar o modal
        this.dialog.closeAll();
      },
      error: () => {
        this.isLoading = false;
        // this.errorMessage = 'E-mail ou senha inválidos.';
        this.loginForm.get('email')?.setErrors({ 'invalidEmail': true });
        this.loginForm.get('password')?.setErrors({ 'invalidPassword': true });
      }
    });
  }
}
