import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../security/services/auth/auth.service';
import { IAddress } from '../../interface/inter-Address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

 private baseUrl = 'your-api-url'; // Replace with your actual API URL

  private authToken: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.baseUrl = `${environment.apiUrl}`;

    this.authToken = this.authService.getToken();
  }

  
}
