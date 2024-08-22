import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../user-login-modal/user-login-modal.component';
import { AuthService } from '../../../services/auth/auth.service';
import { IResetPasswordResponse } from '../../../../interface/inter-Login';
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
  ){ }

  ngOnInit(): void {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.resetPasswordForm = this.fb.group({
      email: this.emailControl
    });
  }
  resetPassword(){
    // Implemente a lógica de envio de e-mail para redefinição de senha
    this.response = this.auth.resetPassword(this.resetPasswordForm.value.email);
    this.dialogRef.close();
    if(this.response){
      this.router.navigate(['login']); // redirecionar para a troca de senha
    }
  }

  openLoginModal() {
    this.router.navigate(['login']);
  }
}
