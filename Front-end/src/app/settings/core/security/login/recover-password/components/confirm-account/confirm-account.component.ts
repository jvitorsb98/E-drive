import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from '../../../../../services/Alertas/alertas.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss'
})
export class ConfirmAccountComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private alertasService: AlertasService
  ) { }

  ngOnInit(): void {
    // Captura o token da URL
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.confirmAccount(token);
    } else {
      this.alertasService.showError('Erro', 'Token de confirmação inválido ou ausente.').then(() => {
        this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
      });
    }
  }

  // Chama o serviço de autenticação para confirmar a conta
  confirmAccount(token: string) {
    this.authService.confirmAccount(token).subscribe({
      next: (response) => {
        this.alertasService.showSuccess('Confirmação de conta', response);
        this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
      },
      error: (err) => {
        this.alertasService.showError('Confirmação de conta', err.error || 'Falha ao confirmar a conta.');
        this.router.navigate(['/e-driver/login']); // Redireciona para a tela de login
      }
    });
  }
}
