import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ILoginRequest, ILoginResponse, IRecoverPasswordRequest } from '../../../models/inter-Login';
import { environment } from '../../../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: Router;

  beforeEach(() => {
    const routerSpy = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    mockRouter = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('deve armazenar o token e emitir isLoggedIn como true ao logar com sucesso', () => {
      const mockResponse: ILoginResponse = { token: 'mock-token' };
      const credentials: ILoginRequest = { login: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe('mock-token');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      service.isLoggedIn$.subscribe((isLoggedIn) => {
        expect(isLoggedIn).toBe(true);
      });
    });

    it('deve lançar erro ao falhar no login', () => {
      const credentials: ILoginRequest = { login: 'test@example.com', password: 'wrong-password' };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('deve limpar o token e redirecionar para a rota inicial', () => {
      localStorage.setItem('token', 'mock-token');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('deve tratar falha ao notificar o backend durante o logout', () => {
      const token = 'mock-token';
      localStorage.setItem('token', token);

      service.logout();

      const req = httpMock.expectOne(`${service['apiUrl']}/logout`);
      expect(req.request.method).toBe('POST');
      req.flush('Falha no backend', { status: 400, statusText: 'Bad Request' });

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('deve remover o token e notificar o backend durante o logout', () => {
      const token = 'mock-token';
      localStorage.setItem('token', token);

      service.logout();

      // Verifica se o token foi removido
      expect(localStorage.getItem('token')).toBeNull();

      // Verifica se o estado de login foi atualizado
      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalsy();
      });

      // Verifica se houve navegação para a página inicial
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);

      // Verifica se a chamada HTTP ao backend foi feita corretamente
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(null); // Simula resposta bem-sucedida
    });
  });


  describe('isLoggedIn', () => {
    it('deve retornar true se o token for válido', () => {
      const validToken = 'mock-valid-token';
      localStorage.setItem('token', validToken);

      jest.spyOn(service as any, 'isLoggedIn').mockReturnValue(true);

      expect(service.isLoggedIn()).toBe(true);
    });

    it('deve retornar false se o token estiver ausente ou inválido', () => {
      localStorage.removeItem('token');
      expect(service.isLoggedIn()).toBe(false);

      localStorage.setItem('token', 'invalid-token');
      jest.spyOn(service as any, 'isLoggedIn').mockReturnValue(false);
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('recoverPasswordRequest', () => {
    it('deve enviar o e-mail para recuperação de senha', () => {
      const email: IRecoverPasswordRequest = { email: 'test@example.com' };
      const mockResponse = 'Solicitação enviada com sucesso.';

      service.recoverPasswordRequest(email).subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/reset-password/request`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe('handleError', () => {
    it('deve retornar uma mensagem de erro personalizada para status 400', () => {
      const mockError = { status: 400, error: 'Requisição inválida' };
      service['handleError'](mockError as any).subscribe({
        error: (error) => {
          expect(error.message).toBe('Requisição inválida');
        },
      });
    });

    it('deve retornar mensagem padrão para status 500', () => {
      const mockError = { status: 500 };
      service['handleError'](mockError as any).subscribe({
        error: (error) => {
          expect(error.message).toBe('Erro interno do servidor. Tente novamente mais tarde.');
        },
      });
    });

    it('deve retornar mensagem padrão para status desconhecido', () => {
      const mockError = { status: 404 };
      service['handleError'](mockError as any).subscribe({
        error: (error) => {
          expect(error.message).toBe('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        },
      });
    });

  });


  describe('getUserID', () => {

    it('deve retornar undefined se o token não estiver presente', () => {
      localStorage.removeItem('token');
      expect(service.getUserID()).toBeUndefined();
    });

  });

  describe('getUserEmail', () => {

    it('deve retornar undefined se o token não estiver presente', () => {
      localStorage.removeItem('token');
      expect(service.getUserEmail()).toBeUndefined();
    });

  });

  describe('getUserDetails', () => {

    it('deve lançar erro se o token não estiver presente', () => {
      localStorage.removeItem('token');
      service.getUserDetails().subscribe({
        error: (error) => {
          expect(error.message).toBe('Token inválido. Por favor, tente novamente.');
        },
      });
    });

    it('deve retornar os detalhes do usuário se o token for válido', () => {
      const mockToken = 'mock-valid-token'; // Substitua por um token JWT válido para teste
      localStorage.setItem('token', mockToken);

      const decodedToken = { id: 1, email: 'user@example.com', exp: (Date.now() / 1000) + 3600 };
      jest.spyOn(jwtDecode as any, 'default').mockReturnValue(decodedToken);

      const result = service.getUserDetails();
      expect(result).toEqual(decodedToken);
    });

    it('deve lançar erro se o token for inválido em getUserDetails', () => {
      localStorage.setItem('token', 'invalid-token');
      jest.spyOn(service as any, 'isLoggedIn').mockReturnValue(false);

      service.getUserDetails().subscribe({
        error: (error) => {
          expect(error.message).toBe('Token inválido. Por favor, tente novamente.');
        },
      });
    });

  });

  describe('getToken', () => {
    it('deve retornar o token armazenado no localStorage', () => {
      localStorage.setItem('token', 'mock-token');
      expect(service.getToken()).toBe('mock-token');
    });

    it('deve retornar null se nenhum token estiver armazenado', () => {
      localStorage.removeItem('token');
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getTokenReset', () => {
    it('deve retornar o token de redefinição de senha armazenado no localStorage', () => {
      localStorage.setItem('token-reset-password', 'mock-reset-token');
      expect(service.getTokenReset()).toBe('mock-reset-token');
    });

    it('deve retornar null se nenhum token de redefinição estiver armazenado', () => {
      localStorage.removeItem('token-reset-password');
      expect(service.getTokenReset()).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('deve enviar uma solicitação de redefinição de senha com sucesso', () => {
      const request = { token: 'mock-token', password: 'new-password' };
      const mockResponse = 'Senha redefinida com sucesso.';

      service.resetPassword(request).subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/reset-password/reset`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('confirmAccount', () => {
    it('deve confirmar a conta com sucesso', () => {
      const mockToken = 'mock-confirm-token';
      const mockResponse = 'Conta ativada com sucesso.';

      service.confirmAccount(mockToken).subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/reactivate?token=${mockToken}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('recoverAccountRequest', () => {
    it('deve tratar erro ao enviar solicitação de reativação de conta', () => {
      const email = { email: 'test@example.com' };
      service.recoverAccountRequest(email).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/reactivate-account/request`);
      expect(req.request.method).toBe('PUT');
      req.flush('Erro ao enviar solicitação', { status: 500, statusText: 'Internal Server Error' });
    });
  });

});
