import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DataAddressDetails, IAddressRequest, IAddressResponse } from '../../models/inter-Address';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginatedResponse } from '../../models/paginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private addressUrl: string; // Replace with your actual API URL

  // Inicializa o BehaviorSubject com um valor null ou vazio
  private addressSource = new BehaviorSubject<any>(null);
  // Exponha o BehaviorSubject como um Observable
  selectedAddress$ = this.addressSource.asObservable();

  // BehaviorSubject para o título da página
  private titleSource = new BehaviorSubject<string>('');
  selectedTitle$ = this.titleSource.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.addressUrl = `${environment.apiUrl}/api/v1/address`;
  }

  register(address: IAddressRequest): Observable<any> {
    // retornar a resposta do servidor para o componente pai
    return this.http.post(this.addressUrl, address).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    )
  }

  // Função para buscar um endereço pelo ID
  getById(id: number): Observable<IAddressResponse> {
    return this.http.get<IAddressResponse>(`${this.addressUrl}/${id}`).pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  // Função para buscar todos os endereços do usuario
  getAll(): Observable<PaginatedResponse<DataAddressDetails>> {
    return this.http.get<PaginatedResponse<DataAddressDetails>>(`${this.addressUrl}/user`);
  }

  listAll(page: number, size: number): Observable<PaginatedResponse<DataAddressDetails>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'city');
    return this.http.get<PaginatedResponse<DataAddressDetails>>(`${this.addressUrl}/user`, { params: params });
  }

  // Função para atualizar um endereço
  update(id: number, addressData: IAddressRequest): Observable<DataAddressDetails> {
    return this.http.put<DataAddressDetails>(`${this.addressUrl}/${id}`, addressData);
  }

  // Função para desabilitar um endereço
  disable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.addressUrl}/${id}`);
  }

  // Método para definir o endereço atual
  selectAddress(address: any) {
    this.addressSource.next(address);
  }

  // Método para limpar o endereço
  clearSelectedAddress() {
    this.addressSource.next(null);
  }

  // Método para definir o título da página
  setTitle(title: string) {
    if (title == '') {
      title = 'Registrar endereço';
    }
    this.titleSource.next(title);
  }

  // Método para limpar o título da página
  clearTitle() {
    this.titleSource.next("Registrar endereço");
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      console.error(
        `Backend retornou o código ${error.status}, ` +
        `corpo da mensagem: ${error.error}`
      );
      if (error.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (error.status === 401) {
        errorMessage = 'Não autorizado. Faça login e tente novamente.';
      } else if (error.status === 403) {
        errorMessage = 'Acesso proibido. Você não tem permissão para realizar esta ação.';
      } else if (error.status === 404) {
        errorMessage = 'Endereço não encontrado.';
      }
    }
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
    });
    return throwError(errorMessage);
  }
}
