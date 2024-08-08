import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl!: string;
  private storageKey = 'user';

  constructor(private http: HttpClient) {
    // this.usersUrl = `${environment.apiUrl}/users`;
  }

  // Método para obter todos os usuários reais
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user);
  }

  // Metodos para guardar e recuperar dados do usuário no localStorage
  saveUserData(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getUserData(): any {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.storageKey);
  }
  //-------------------------------------------------------------------
}
