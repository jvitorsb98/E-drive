import { Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { passwordMatchValidator } from '../../../../shared/validators/confirm-password.validators';
import { PasswordFieldValidator } from '../../../../shared/validators/password-field.validator';
import { User } from '../../../../core/models/user';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserLoginModalComponent } from '../../../../core/security/login/user-login-modal/user-login-modal.component';
import { ModalService } from '../../../../core/services/modal/modal.service';
import { filter, take } from 'rxjs';
import { AuthService } from '../../../../core/security/services/auth/auth.service';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent implements OnInit {
  @Input() title: string = 'Criar sua senha'; // valores padrão
  @Input() subtitle: string = 'Escolha uma senha forte para proteger sua conta.'; // valores padrão
  @Input() btnText: string = 'Finalizar cadastro'; // valores padrão
  @Input() isPasswordChange: boolean = false;

  userPassword!: FormGroup;

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private auth: AuthService,
    private router: Router,
    private routerActivator: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) private userData: User,
    public dialogRef: MatDialogRef<UserPasswordModalComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
    PasswordFieldValidator.initializePasswordField(this.renderer, this.el);

    // Obtem os valores passados na rota
    this.routerActivator.queryParams.subscribe(
      (params) => {
        this.title = params['title'] || this.title; // Usa o valor passado ou o valor padrão
        this.subtitle = params['subtitle'] || this.subtitle;
        this.btnText = params['btnText'] || this.btnText;
        this.isPasswordChange = params['isPasswordChange'] === 'true'; // conversão de string para boolean
      }
    )
  }

  // Cria e inicializa o formulário com validação de senha e confirmação de senha.
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required),
      newsletter: new FormControl(false, Validators.requiredTrue)
    }, { validators: passwordMatchValidator });
  }

  // função para direcionar se é para trocar a senha ou criar um usuário
  saveUser(): void {
    if (this.isPasswordChange){
      this.changePassword();
    }else{
      this.createUser();
    }
  }

  // Função para criar um usuário
  createUser() {
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
          }).then((result) => {
            if (result.isConfirmed) {
              // Primeiro inscreva-se no evento de navegação para abrir o modal
              this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                take(1) // Certifica-se de que o evento de navegação seja emitido apenas uma vez para evitar vazamentos de memória.
              ).subscribe(() => {
                // Abre o modal após a navegação
                this.openLoginModal();
              });
              // Depois navega para a página de introdução
              this.router.navigate(['/intro-page']);
            }
          });
        },
        error: (e) => {
          Swal.fire({
            title: 'Erro!',
            icon: 'error',
            text: `Houve um problema ao cadastrar ${this.userData.name}. Tente novamente mais tarde.`,
            showConfirmButton: true,
            confirmButtonColor: '#19B6DD',
          });
        }
      });
    }
  }

  // função para troca de senha
  changePassword(): void {
    if (this.userPassword.valid) {
      const token = this.auth.getTokenReset()
      if (token) {
        this.auth.resetPassword(token, this.userPassword.value.password).subscribe({
          next: (response) => {
            console.log('Senha alterada com sucesso', response); todo://remover depois
            Swal.fire({
              title: 'Senha alterada com sucesso!',
              icon: 'success',
              text: `Sua senha foi alterada com sucesso. `,
              showConfirmButton: true,
              confirmButtonColor: '#19B6DD',
            }).then((result) => {
              if (result.isConfirmed) {
                this.closeModal();
                this.router.navigate(['/login']);
              }
            })
          },
          error: (e) => {
            Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: `Houve um problema ao alterar sua senha. Tente novamente mais tarde.`,
              showConfirmButton: true,
              confirmButtonColor: '#19B6DD',
            });
          }
        });
      }
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

  openLoginModal() {
    this.modalService.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
