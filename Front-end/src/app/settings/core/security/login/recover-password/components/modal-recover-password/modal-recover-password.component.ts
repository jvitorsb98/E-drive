import { AlertasService } from './../../../../../services/Alertas/alertas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth/auth.service';

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
    private alertasService: AlertasService
  ) { }

  ngOnInit(): void {
    this.emailControl = new FormControl('', {
      validators: [Validators.required, Validators.email]
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
    
          // Exibir mensagem de sucesso com a resposta
          this.alertasService.showSuccess("Redefinição de senha", response)
            .then(() => {
              this.dialogRef.close(); // Fecha o modal após o sucesso
            });
        },
        error: (error) => {
  
          const errorMessage = error.error ? error.error : 'Ocorreu um erro ao tentar enviar o e-mail de redefinição.';
          this.alertasService.showError("Redefinição de senha", errorMessage);
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

