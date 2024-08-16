import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/User';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  isEditing: boolean = false; // Controla o modo de edição, tipo booleano
  userForm!: FormGroup;
  user: User = new User();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadUserData();
  }

  // Método para construir o formulário
  buildForm() {
    this.userForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.email]),
      birth: new FormControl(null, Validators.required),
      cellPhone: new FormControl(null, Validators.required)
    });
  }

  // Carrega os dados do usuário para edição
  loadUserData() {
    const userEmail = this.route.snapshot.paramMap.get('email');
    this.userService.getAllUsers().subscribe(users => {
      const foundUser = users.find(user => user.email === userEmail);
      if (foundUser) {
        this.user = foundUser;
        this.userForm.patchValue(this.user);
      }
    });
  }

  // Método para iniciar a edição dos dados
  editData() {
    this.isEditing = true; // Seta o modo de edição como verdadeiro
  }

  // Método para cancelar a edição
  cancelEdit() {
    this.isEditing = false; // Seta o modo de edição como falso
    this.userForm.patchValue(this.user); // Reverte as alterações
  }

  // Método para atualizar o usuário
  updateUser() {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value };
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.isEditing = false;
          this.router.navigate(['/user-list']); // Redireciona para a lista de usuários
        },
        error: (e) => {
          console.error('Erro ao atualizar usuário:', e);
          alert('Ocorreu um erro ao atualizar o usuário.');
        }
      });
    }
  }

  // Método para excluir a conta do usuário
  deleteAccount() {
    // Implementação da exclusão de conta
  }
}
