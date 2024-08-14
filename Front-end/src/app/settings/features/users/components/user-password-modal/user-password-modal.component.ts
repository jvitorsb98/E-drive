import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { passwordMatchValidator } from '../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../shared/validators/password-field.validator';
import { User } from '../../../../core/models/User';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent implements OnInit {

  userPassword!: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public userData: User,
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
      this.userData.password = this.userPassword.value.password;

      this.userService.addUser(this.userData).subscribe({
        next: (response) => {
          console.log('Usuário cadastrado', response);

          this.userPassword.reset();
          this.closeModal();

          Swal.fire({
            title: 'Cadastro bem-sucedido!',
            icon: 'success',
            text: `${this.userData.name} cadastrado(a) com sucesso. Um email de ativação foi enviado.`,
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          });
        },
        error: (e) => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: 'Houve um problema ao cadastrar o usuário. Tente novamente mais tarde.',
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          });
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onFormClick(event: Event) {
    // Verifica se as senhas foram preenchidas
    const password = this.userPassword.get('password')?.value;
    const confirmPassword = this.userPassword.get('confirmPassword')?.value;

    if (password && confirmPassword) {
      // Verifica se o clique foi dentro do formulário
      const target = event.target as HTMLElement;
      const formElement = document.querySelector('.container-fluid');
      if (formElement && formElement.contains(target)) {
        this.validateForm();
      }
    }
  }

  validateForm() {
    if (this.userPassword.get('newsletter')?.invalid) {
      this.userPassword.get('newsletter')?.markAsTouched();
    }
  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
