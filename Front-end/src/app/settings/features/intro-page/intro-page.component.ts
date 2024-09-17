// Serviço para gerenciar modais
import { ModalService } from '../../core/services/modal/modal.service';

// Componente para o modal de login
import { UserLoginModalComponent } from '../../core/security/login/user-login-modal/user-login-modal.component';

// Serviço de autenticação
import { AuthService } from '../../core/security/services/auth/auth.service';

// Imports do Angular
import { Component } from '@angular/core';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'] // Corrigido para 'styleUrls'
})
export class IntroPageComponent {

  constructor(
    private modal: ModalService, // Serviço para gerenciar modais
  ) {
  }

  // Abre o modal de login
  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent);
  }
}
