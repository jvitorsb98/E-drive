import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { User } from '../../../../core/models/User';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  isEditing: boolean = false; // Controla o modo de edição
  userForm!: FormGroup;
  user: User = new User();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadUserData();
  }

  // Método para construir o formulário
  private buildForm() {
    this.userForm = this.formBuilder.group({
      name: [{ value: '', disabled: !this.isEditing }, [Validators.required, Validators.minLength(2)]],
      birth: [{ value: '', disabled: !this.isEditing }, Validators.required],
      cellPhone: [{ value: '', disabled: !this.isEditing }, Validators.required]
    });
  }

  // Método para carregar os dados do usuário autenticado
  private loadUserData() {
    this.userService.getAuthenticatedUserDetails().subscribe(
      (user: User) => {
        this.user = user;
        this.userForm.patchValue({
          name: user.name || '',
          birth: user.birth ? new Date(user.birth).toISOString().substring(0, 10) : '', // Formatando a data para o formato 'yyyy-MM-dd'
          cellPhone: user.cellPhone || ''
        });
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
  }

  // Método para alternar para o modo de edição
  editData() {
    this.isEditing = true;
    this.userForm.enable();
  }

  // Método para cancelar a edição
  cancelEdit() {
    this.isEditing = false;
    this.userForm.disable();
    this.loadUserData(); // Recarrega os dados originais do usuário
  }

  // Método para atualizar os dados do usuário
  updateUser() {
    if (this.userForm.valid) {
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value,
        birth: this.userForm.get('birth')?.value ? new Date(this.userForm.get('birth')?.value) : null // Convertendo a data do formato string para Date
      };
      this.userService.updateUser(updatedUser).subscribe(
        (response: User) => {
          console.log('Dados do usuário atualizados com sucesso:', response);
          this.isEditing = false;
          this.userForm.disable();
          // Redirecionar ou mostrar uma mensagem de sucesso
        },
        (error) => {
          console.error('Erro ao atualizar os dados do usuário:', error);
        }
      );
    }
  }

  // Método para excluir a conta do usuário
  deleteAccount() {
    // Implementar a lógica de exclusão da conta aqui
    console.log('Excluir conta do usuário');
  }

}
