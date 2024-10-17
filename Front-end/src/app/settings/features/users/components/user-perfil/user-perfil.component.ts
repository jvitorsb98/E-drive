import { Component } from '@angular/core';
import { User } from '../../../../core/models/user';
import { AlertasService } from '../../../../core/services/Alertas/alertas.service';
import { UserService } from '../../../../core/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrl: './user-perfil.component.scss'
})
export class UserPerfilComponent {

  userData = {} as User;

  userProfileImage = 'assets/images/user-avatar.png';  // Caminho da imagem


  constructor(
    private userService: UserService,
    private alertService: AlertasService,
    private router: Router
  ) {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.getAuthenticatedUserDetails().subscribe({
      next: (user: User) => {
        const birthDate = new Date(user.birth!);
        const userBirthDate = new Date(birthDate.getTime() + birthDate.getTimezoneOffset() * 60000);

        this.userData = {
          ...user,
          birth: userBirthDate
        };
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário', err);
      }
    });
  }

  editData(){
    this.router.navigate(['e-driver/users/update']);
  }

  deleteAccount() {
    this.alertService.showWarning('Desativar conta do usuário', "Deseja realmente desativar a sua conta '" + this.userService.getUserEmail() +"' ?", 'Desativar' ,'Cancelar').then((result) => {
      if (result) {
        const id = this.userService.getUserID() || 0;
        this.userService.deactivate(id).subscribe({
          next: () => {
            this.alertService.showSuccess('Conta desativada com sucesso', 'Agora você pode criar novas contas.');
            this.onLogout();
          },
          error: (err) => {
            this.alertService.showError('Erro ao desativar a conta', err.message);
          }
        })
      }
    });
  }

  onLogout(): void {
    this.userService.logout();
  }
}
