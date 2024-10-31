import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../security/services/auth/auth.service';

@Component({
  selector: 'app-navbar-intro',
  templateUrl: './navbar-intro.component.html',
  styleUrl: './navbar-intro.component.scss'
})
export class NavbarIntroComponent {
  isMenuOpen = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService

  ) {}

  openLoginModal() {
    this.closeMenu();
    this.router.navigate(['/e-driver/login']);
  }

  openRegisterModal() {
    this.closeMenu();
    this.router.navigate(['/e-driver/users/registration']);
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
