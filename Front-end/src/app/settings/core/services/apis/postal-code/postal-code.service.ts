import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService {
  private readonly apiUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) { }

  searchPostalCode(postalCode: string): Observable<any> {
    postalCode = postalCode.replace(/\D/g, ''); // Remove tudo o que não é número
    return this.http.get(`${this.apiUrl}${postalCode}/json/`);
  }
}
