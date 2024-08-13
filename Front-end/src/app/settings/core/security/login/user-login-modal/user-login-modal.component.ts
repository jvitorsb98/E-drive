import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { AuthService } from '../../../../core/security/services/auth/auth.service';
import { LoginRequest } from '../../../../core/models/ineter-Login';
import { ResetPasswordComponent } from '../recover-password/reset-password/reset-password.component';

@Component({
  selector: 'app-user-login-modal',
  templateUrl: './user-login-modal.component.html',
  styleUrl: './user-login-modal.component.scss'
})
export class UserLoginModalComponent {
  loginForm !: FormGroup;
  loginRequest!: LoginRequest;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private modal: ModalService,
    private auth: AuthService
  ){}

  /* Chama o modal de-esquecimento de senha */
  modalResetPassword(){
    this.modal.openModal(ResetPasswordComponent).subscribe(result => {
      if (result) {
        this.auth.resetPassword(result.email);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.auth.login(this.loginRequest).subscribe({
      next: () => {
        // armazenar a response de login no localStorage
        console.log('Login realizado com sucesso!');
        console.log(this.loginRequest);
        // redirecionar para a rota home/dashboard

        // fechar o modal
        this.dialog.closeAll();
      },
      error: () => {
        this.loginForm.get('email')?.setErrors({ 'invalidEmail': true });
        this.loginForm.get('password')?.setErrors({ 'invalidPassword': true });
      }
    });
  }
}
