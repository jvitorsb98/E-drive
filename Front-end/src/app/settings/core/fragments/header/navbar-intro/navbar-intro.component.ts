import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';
import { UserLoginModalComponent } from '../../../security/login/user-login-modal/user-login-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../security/services/auth/auth.service';

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
    private router: Router,
    private authService: AuthService

  ) {}

  openLoginModal() {
    this.closeMenu();
    // this.modal.openModal(UserLoginModalComponent)
    this.router.navigate(['/login']);
  }

  openRegisterModal() {
    this.closeMenu();
    // this.modal.openModal(UserRegistrationModalComponent)
    this.router.navigate(['/user-registration']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); 
  }
}
