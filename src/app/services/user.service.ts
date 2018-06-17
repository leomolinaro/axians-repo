import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Ricerca l'utente a partire dal nome utente.
   * @param username Il nome utente da ricercare.
   * @return Un observable che restituisce il model dell'utente trovato in caso di successo o che dà un errore altrimenti.
   */
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User> (
      "https://api.github.com/users/" + username, 
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );
  }

}
