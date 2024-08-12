import { Component } from '@angular/core';
import { UserLoginModalComponent } from '../../core/security/login-form/user-login-modal/user-login-modal.component';
import { ModalService } from '../../core/services/modal/modal.service';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrl: './intro-page.component.scss'
})
export class IntroPageComponent {

  constructor(
    private modal: ModalService
  ) { }
  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
