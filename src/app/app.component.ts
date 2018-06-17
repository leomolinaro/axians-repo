import { User } from './models/user';
import { UserService } from './services/user.service';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  /**Controller dell'input box di ricerca.*/
  usernameControl = new FormControl("");

  /**Flag che indica lo stato di caricamento.*/
  isLoading: boolean = false;

  /**Il model dell'utente trovato.*/
  user: User = null;

  constructor(private userService: UserService) { }

  /**
   * Ricerca l'utente a partire dallo username specificato nell'input box.
   * Imposta lo stato di caricamento durante il reperimento del dato da API.
   * Gestisce lo stato di validità dell'input box, a seconda che l'username sia stato trovato o meno.
   */
  searchUser() {
    this.isLoading = true;
    this.user = null;
    this.usernameControl.setErrors({});
    this.usernameControl.markAsPending();
    this.userService.getUserByUsername(this.usernameControl.value)
    .subscribe({
      next: user => {
        this.user = user;
        this.usernameControl.markAsTouched ();
        this.isLoading = false;
      },
      error: error => {
        this.usernameControl.setErrors({ notFound: true });
        this.usernameControl.markAsTouched();
        this.isLoading = false;
      }
    });
  }

  /**
   * Pulisce l'input box e l'utente precedentemente trovato.
   */
  clear() {
    this.user = null;
    this.usernameControl.reset();
    this.usernameControl.setValue("");
  }

}
