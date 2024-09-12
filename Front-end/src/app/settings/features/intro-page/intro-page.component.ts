import { Component } from '@angular/core';
import { ModalService } from '../../core/services/modal/modal.service';
import { UserLoginModalComponent } from '../../core/security/login/user-login-modal/user-login-modal.component';
import { AuthService } from '../../core/security/services/auth/auth.service';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrl: './intro-page.component.scss'
})
export class IntroPageComponent {

  constructor(
    private modal: ModalService,
    private auth: AuthService
  ) {
    auth.logout();
  }
  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
