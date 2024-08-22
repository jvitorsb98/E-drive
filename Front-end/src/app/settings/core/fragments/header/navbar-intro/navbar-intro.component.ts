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
    this.closeMenu();
    this.modal.openModal(UserLoginModalComponent)
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
