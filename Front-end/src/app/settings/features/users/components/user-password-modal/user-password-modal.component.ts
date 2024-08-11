import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { UserDataService } from '../../../../core/services/user/userdata/user-data.service';

@Component({
  selector: 'app-user-password-modal',
  templateUrl: './user-password-modal.component.html',
  styleUrl: './user-password-modal.component.scss'
})
export class UserPasswordModalComponent {

  userPassword!: FormGroup;
  private isBrowser: boolean;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID)
    private platformId: Object,
    public dialogRef: MatDialogRef<UserPasswordModalComponent>,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.buildForm();
    if (this.isBrowser) {
      this.initializePasswordField();
    }
  }

  // Cria e inicializa o formulário com validação de senha e confirmação de senha.
  buildForm() {
    this.userPassword = this.formBuilder.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, Validators.required)
    }, { validators: this.passwordMatchValidator });
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

  // Função para validar se a senha possui os requisitos mínimos de segurança e para mostrar/ocultar a senha
  initializePasswordField(): void {
    const passwordInput = this.el.nativeElement.querySelector(".password-input");
    const confirmPasswordInput = this.el.nativeElement.querySelector(".confirm-password-input");
    const passwordEyeIcon = this.el.nativeElement.querySelector(".password-eye-icon");
    const confirmPasswordEyeIcon = this.el.nativeElement.querySelector(".confirm-password-eye-icon");
    const requirementList = this.el.nativeElement.querySelectorAll(".requirement-list li");

    const requirements = [
      { regex: /.{8,}/, index: 0 },
      { regex: /[0-9]/, index: 1 },
      { regex: /[a-z]/, index: 2 },
      { regex: /[^A-Za-z0-9]/, index: 3 },
      { regex: /[A-Z]/, index: 4 },
    ];

    // Lógica para os requisitos da senha 
    this.renderer.listen(passwordInput, 'keyup', (e) => {
      requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);
        const requirementItem = requirementList[item.index];
        if (isValid) {
          this.renderer.addClass(requirementItem, 'valid');
          this.renderer.setAttribute(requirementItem.firstElementChild, 'class', 'bi bi-check-circle-fill');
        } else {
          this.renderer.removeClass(requirementItem, 'valid');
          this.renderer.setAttribute(requirementItem.firstElementChild, 'class', 'bi bi-bag-x-fill');
        }
      });
    });

    // Lógica para o campo 'password'
    this.renderer.listen(passwordEyeIcon, 'click', () => {
      const isHidden = passwordInput.classList.toggle("hidden-text");
      this.renderer.setAttribute(passwordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
    });

    // Lógica para o campo 'confirmPassword'
    this.renderer.listen(confirmPasswordEyeIcon, 'click', () => {
      const isHidden = confirmPasswordInput.classList.toggle("hidden-text");
      this.renderer.setAttribute(confirmPasswordEyeIcon, 'class', `bi ${isHidden ? "bi-eye-slash-fill" : "bi-eye"}`);
    });
  }

  // Função para validar se a senha e a confirmação de senha são iguais
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Função para fechar o modal
  closeModal() {
    this.dialogRef.close();
  }
}
