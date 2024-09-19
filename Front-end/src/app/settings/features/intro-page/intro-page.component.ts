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


  constructor(private modal: ModalService) { }

  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: .5
    });

    const elementos = document.querySelectorAll('.fade-in');
    elementos.forEach(element => {
      observer.observe(element);
    });
  }
}
