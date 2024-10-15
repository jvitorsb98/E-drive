import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken(); // Obtém o token do serviço

    // URLs que não precisam do token
    const nonAuthUrls = ['/auth/login', '/auth/register', '/user/exists', '/auth/reset-password/request', '/reactivate-account/request', '/reactivate'];

    // Verifica se a URL da requisição está na lista de URLs sem autenticação
    if (nonAuthUrls.some(url => request.url.includes(url))) {
      return next.handle(request); // Não adiciona o token
    }

    // Se o token estiver presente, adiciona no cabeçalho da requisição
    if (token) {
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
        }
      });
      return next.handle(req);
    }

    return next.handle(request); // Se não houver token, segue sem modificações
  }
}
