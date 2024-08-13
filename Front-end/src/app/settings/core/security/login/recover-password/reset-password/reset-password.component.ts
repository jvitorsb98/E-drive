import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../user-login-modal/user-login-modal.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  emailControl!: FormControl;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    private fb: FormBuilder,
    private modal: ModalService
  ){ }

  ngOnInit(): void {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.resetPasswordForm = this.fb.group({
      email: this.emailControl
    });
  }
  resetPassword(){
    // Implemente a lógica de envio de e-mail para redefinição de senha
    console.log(this.resetPasswordForm.value.email);
    this.dialogRef.close();
  }

  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        todo://implementação resposta de login
        console.log(result);
      }else{
        todo://implementação resposta  caso nao consiga realizar o login, ou o usuario cancela o processo de login
        console.log(result);
      }
    });
  }
}
