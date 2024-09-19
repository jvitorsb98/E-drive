import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken(); // Obtém o token do serviço

    if (token) {
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Adiciona o token ao cabeçalho
        }
      });
      return next.handle(req);
    }

    return next.handle(request);
  }
}
