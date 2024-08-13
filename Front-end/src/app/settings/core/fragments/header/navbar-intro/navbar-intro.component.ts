import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../../security/login/user-login-modal/user-login-modal.component';

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
        console.log(result);
      }
    });
  }
}
