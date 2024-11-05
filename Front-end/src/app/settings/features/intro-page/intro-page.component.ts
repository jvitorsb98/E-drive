// Serviço para gerenciar modais
import { ModalService } from '../../core/services/modal/modal.service';

// Componente para o modal de login
import { UserLoginModalComponent } from '../../core/security/login/user-login-modal/user-login-modal.component';

// Serviço de autenticação
import { AuthService } from '../../core/security/services/auth/auth.service';

// Imports do Angular
import { Component, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * Componente responsável por exibir a página de introdução e gerenciar o modal de login.
 * Também implementa a animação de fade-in para elementos ao serem visualizados.
 *
 * **Passo a passo de chamada de métodos:**
 * 1. **openLoginModal**: Abre o modal de login e exibe o componente `UserLoginModalComponent`. Se um resultado for retornado do modal, ele é exibido no console.
 * 2. **ngAfterViewInit**: Método do ciclo de vida do Angular chamado após a visualização do componente ser inicializada. Utiliza o `IntersectionObserver` para observar elementos com a classe `fade-in` e aplicar a classe `show` quando os elementos ficam visíveis na tela.
 */
@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'] // Corrigido para 'styleUrls'
})
export class IntroPageComponent implements AfterViewInit {

  constructor(private modal: ModalService, private renderer: Renderer2) { }

  /**
   * Abre o modal de login ao chamar o serviço `ModalService`.
   * O modal exibe o componente `UserLoginModalComponent` e, ao fechar, se houver um resultado,
   * o mesmo é capturado e exibido no console.
   */
  openLoginModal() {
    this.modal.openModal(UserLoginModalComponent).subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  /**
   * Método chamado após a visualização do componente ser inicializada.
   * Configura um `IntersectionObserver` para observar os elementos com a classe `fade-in` e adiciona
   * a classe `show` quando os elementos entram na área visível da tela (threshold de 50%).
   */
  ngAfterViewInit() {

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const parallaxElement = document.querySelector('.parallax');

    if (parallaxElement) {
      // Aplica background-attachment de acordo com o sistema operacional
      if (isIOS) {
        this.renderer.setStyle(parallaxElement, 'backgroundAttachment', 'scroll');
        this.renderer.setStyle(parallaxElement, '-webkit-overflow-scrolling', 'touch');
      } else {
        this.renderer.setStyle(parallaxElement, 'backgroundAttachment', 'fixed');
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.5
    });

    // Seleciona todos os elementos com a classe 'fade-in' para observação
    const elementos = document.querySelectorAll('.fade-in');
    elementos.forEach(element => {
      observer.observe(element);
    });
  }
}
