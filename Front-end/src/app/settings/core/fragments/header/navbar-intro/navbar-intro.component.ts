import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../services/modal/modal.service';

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
    this.modal.openModal('login'); // trocar para o componenete de login
  }
}
