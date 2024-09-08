import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../services/modal/modal.service';
import { AuthService } from '../../../services/auth/auth.service';
import { IResetPasswordResponse } from '../../../../models/inter-Login';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  emailControl!: FormControl;

  response: Observable<IResetPasswordResponse> | undefined;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    private fb: FormBuilder,
    private modal: ModalService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.resetPasswordForm = this.fb.group({
      email: this.emailControl
    });
  }
  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.response = this.auth.resetPasswordRequest(this.resetPasswordForm.value.email);
    this.dialogRef.close();
    if (this.response) {
      this.router.navigate(['reset-password'], {
        queryParams: {
          title: 'Redefinir sua senha',
          subtitle: 'Atualize sua senha para aumentar a segurança da sua conta.',
          btnText: 'Salvar nova senha',
          isPasswordChange: true
        }
      }); // redirecionar para a troca de senha
    }
  }

  openLoginModal() {
    this.dialogRef.close();
  }
}
