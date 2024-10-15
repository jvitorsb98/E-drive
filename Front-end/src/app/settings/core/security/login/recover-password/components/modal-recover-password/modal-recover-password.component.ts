import { AlertasService } from './../../../../../services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import {  emailnoExistsValidator } from '../../../../../../shared/validators/email-exists.validator';
import { UserService } from '../../../../../services/user/user.service';


@Component({
  selector: 'app-modal-recover-password',
  templateUrl: './modal-recover-password.component.html',
  styleUrl: './modal-recover-password.component.scss'
})
export class ModalRecoverPasswordComponent {
  recoverPasswordForm!: FormGroup;
  emailControl!: FormControl;
  email!: string;
  isPasswordRecovery: boolean = true;  // Nova propriedade

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string, isPasswordRecovery: boolean },  // Recebe a flag
    public dialogRef: MatDialogRef<ModalRecoverPasswordComponent>,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private alertasService: AlertasService
  ) { }

  ngOnInit(): void {
    this.emailControl = new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailnoExistsValidator(this.userService)],
    });

    this.recoverPasswordForm = this.fb.group({
      email: this.emailControl
    });

    if (this.data.email) {
      this.recoverPasswordForm.get('email')?.setValue(this.data.email);
    }

    if (this.data.isPasswordRecovery !== undefined) {
      this.isPasswordRecovery = this.data.isPasswordRecovery;  // Define o modo com base no dado recebido
    }
  }

  resetPasswordOrAccount() {
    if (this.recoverPasswordForm.invalid) {
      return;
    }

    if (this.isPasswordRecovery) {
      this.auth.recoverPasswordRequest(this.recoverPasswordForm.value.email).subscribe({
        next: (response: string) => {
          this.alertasService.showSuccess("Redefinição de senha", "Um e-mail de redefinição de senha foi enviado para: " + this.recoverPasswordForm.value.email).then(() => {
            this.dialogRef.close();
            
          });

        },
        error: (error) => {
          console.log(error)
          this.alertasService.showError("Redefinição de senha", error.error);
        }
      });
    } else {
      this.auth.recoverAccountRequest(this.recoverPasswordForm.value.email).subscribe({
        next: () => {
          this.alertasService.showSuccess("Recuperação de conta", "Um e-mail de recuperação de conta foi enviado para: " + this.recoverPasswordForm.value.email).then(() => {
            this.dialogRef.close();
          });
        },
        error: (error: HttpErrorResponse) => {
          this.alertasService.showError("Recuperação de conta", error.error.message);
        }
      });
    }
  }

  // Atualiza o método submit
  onSubmit() {
    this.resetPasswordOrAccount();
  }

  goBack() {
    this.recoverPasswordForm.markAllAsTouched();
    this.recoverPasswordForm.reset();
    this.recoverPasswordForm.setErrors({invalid: true});
    this.dialogRef.close();
  }
}

