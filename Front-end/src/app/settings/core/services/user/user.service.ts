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
  private users: User[] = [];

  constructor(private http: HttpClient) {
    // this.usersUrl = `${environment.apiUrl}/users`;
  }

  // Método para obter todos os usuários reais
  getAllUsers(): Observable<User[]> {
    // return this.http.get<User[]>(this.usersUrl);
    return of(this.users);
  }

  addUser(user: User): Observable<User> {
    this.users.push(user);
      return of(user);
    // return this.http.post<User>(this.usersUrl, user);
  }

}
