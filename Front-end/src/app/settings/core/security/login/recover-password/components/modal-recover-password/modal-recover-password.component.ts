import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { IResetPasswordResponse } from '../../../../../models/inter-Login';
import { AuthService } from '../../../../services/auth/auth.service';
import { emailExistsValidator } from '../../../../../../shared/validators/email-exists.validator';
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

  response: Observable<IResetPasswordResponse> | undefined;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    public dialogRef: MatDialogRef<ModalRecoverPasswordComponent>,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.emailControl = new FormControl ('', [Validators.required, Validators.email], [emailExistsValidator(this.userService)]);
    this.recoverPasswordForm = this.fb.group({
      email: this.emailControl
    });

    if (this.data.email) {
      this.recoverPasswordForm.get('email')?.setValue(this.data.email);
    }
  }

  onSubmit() {
    console.log("Ta chegando qui");
    this.resetPassword();
  }
  resetPassword() {
    if (this.recoverPasswordForm.invalid) {
      return;
    }
    this.auth.recoverPasswordRequest(this.recoverPasswordForm.value.email).subscribe({
      next: () => {
        this.showAlert('Sucesso', 'Um e-mail de redefinicão de senha foi enviado para o e-mail: ' + this.recoverPasswordForm.value.email + '', true);
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert('Erro', error.message);
      }

    });
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

  goBack() {
    this.dialogRef.close();
  }
}
