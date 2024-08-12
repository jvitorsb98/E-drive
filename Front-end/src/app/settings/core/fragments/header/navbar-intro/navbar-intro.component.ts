import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../../../features/users/components/user-login-modal/user-login-modal.component';

@Component({
  selector: 'app-navbar-intro',
  templateUrl: './navbar-intro.component.html',
  styleUrl: './navbar-intro.component.scss'
})
export class NavbarIntroComponent {
  constructor(
    public dialog: MatDialog,
    private modal: ModalService
  ) {}

  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        //this.loginService.login(result.email, result.password); // Exemplo de chamada ao serviço
      }
    });
  }
}
