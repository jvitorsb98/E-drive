import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, RouterOutletContract } from '@angular/router';
import { AuthService } from './settings/core/security/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0,  
          transform: 'translateX(-100%)' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
})
export class AppComponent {
  title = 'E-drive';
  outlet!: RouterOutletContract;

  constructor(private router: Router, private authService: AuthService) { }

  prepareRoute(outlet: RouterOutletContract) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  isHomePage() {
    return this.router.url === '/';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); 
  }

}
