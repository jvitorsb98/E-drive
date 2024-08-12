import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';
import { passwordMatchValidator } from '../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../shared/validators/password-field.validator';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent implements OnInit {

  userPassword!: FormGroup;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    public dialogRef: MatDialogRef<UserPasswordModalComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);
  }

  // Cria e inicializa o formulário com validação de senha e confirmação de senha.
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      newsletter: new FormControl(false, Validators.requiredTrue)
    }, { validators: passwordMatchValidator });
  }

  saveUser(): void {
    if (this.userPassword.valid) {
      const storedUserData = this.userDataService.getUserData();
      this.userDataService.clearUserData();

      if (storedUserData) {
        storedUserData.password = this.userPassword.value.password;

        this.userService.addUser(storedUserData).subscribe(newUser => {

          console.log('Local Storage:', this.userDataService.getUserData());
          console.log('Usuário cadastrado', newUser);

          this.userDataService.clearUserData();
          this.userPassword.reset();
          this.closeModal();

          Swal.fire({
            title: 'Sucesso!',
            icon: 'success',
            text: 'Usuário cadastrado com sucesso!',
            showConfirmButton: true,
          });
        });
      } else {
        console.error('Dados do usuário não encontrados no armazenamento local.');
        // Tratar o caso em que os dados do usuário não são encontrados,
        // Exibir uma mensagem ao usuário ou redirecionar para um fluxo diferente.
      }
    }
  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
