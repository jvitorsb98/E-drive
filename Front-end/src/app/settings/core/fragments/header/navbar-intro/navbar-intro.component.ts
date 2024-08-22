import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../../security/login/user-login-modal/user-login-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-intro',
  templateUrl: './navbar-intro.component.html',
  styleUrl: './navbar-intro.component.scss'
})
export class NavbarIntroComponent {
  isMenuOpen = false;

  constructor(
    public dialog: MatDialog,
    private modal: ModalService,
    private router: Router

  ) {}

  openLoginModal() {
    this.closeMenu();
    // this.modal.openModal(UserLoginModalComponent)
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
