// Serviço para gerenciar modais
import { ModalService } from '../../core/services/modal/modal.service';

// Componente para o modal de login
import { UserLoginComponent } from '../../core/security/login/user-login/user-login.component';

// Serviço de autenticação
import { AuthService } from '../../core/security/services/auth/auth.service';

// Imports do Angular
import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private modal: ModalService, private renderer: Renderer2, private authService: AuthService, private router: Router) { }

  @ViewChild('parallaxElement') parallaxElement!: ElementRef;

  ngOnInit(): void {
    // Verifica se o usuário está autenticado e redireciona para o Dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/e-driver/dashboard']);
    }
  }

  /**
   * Abre o modal de login ao chamar o serviço `ModalService`.
   * O modal exibe o componente `UserLoginModalComponent` e, ao fechar, se houver um resultado,
   * o mesmo é capturado e exibido no console.
   */
  openLoginModal() {
    this.modal.openModal(UserLoginComponent).subscribe(result => {
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
    setTimeout(() => {
      if (this.parallaxElement) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
          this.renderer.setStyle(this.parallaxElement.nativeElement, 'background-attachment', 'scroll');
        } else {
          this.renderer.setStyle(this.parallaxElement.nativeElement, 'background-attachment', 'fixed');
        }
      }
    }, 100);

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

