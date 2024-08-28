import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../security/services/auth/auth.service';
import { IAddress } from '../../interface/inter-Address';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

 private baseUrl = 'your-api-url'; // Replace with your actual API URL

  private authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) {
    this.baseUrl = `${environment.apiUrl}/api/v1/addresses`;

    this.authToken = this.authService.getToken();
  }

  createAddress(address: IAddress): void {
    this.http.post(this.baseUrl, address)
      .subscribe(
        {
          next: () => {
            this.snackBar.open('Endereço criado com sucesso', 'Fechar', { duration: 5000 });
            console.log('Endereço criado com sucesso');
          },
          error: (error) => {
            this.handleError('Erro ao criar endereço', error);
          }
        }
      )
  }

  updateAddress(id: number, address: any): void {
    this.http.put(`${this.baseUrl}/${id}`, address)
      .subscribe(
        {
          next: () => {
            this.snackBar.open('Endereço atualizado com sucesso', 'Fechar', { duration: 5000 });
            console.log('Endereço atualizado com sucesso');
          },
          error: (error) => {
            this.handleError('Erro ao atualizar endereço', error);
          }
        }
      )
  }

  private handleError(message: string, error: any) {
    console.error(error);
    this.snackBar.open(message, 'Fechar', { duration: 5000 });
  }
}
