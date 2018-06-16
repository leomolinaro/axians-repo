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
  
  usernameControl = new FormControl("")
  isLoading: boolean = false;
  user: User = null;

  constructor(private userService: UserService) {}

  searchUser() {
    this.isLoading = true;
    this.user = null;
    this.usernameControl.setErrors({});
    this.usernameControl.markAsPending();
    this.userService.getUserByUsername(this.usernameControl.value)
    .subscribe({
      next: user => {
        this.user = user;
        this.isLoading = false;
      },
      error: error => {
        this.usernameControl.setErrors({ notFound: true });
        this.usernameControl.markAsTouched();
        this.isLoading = false;
      }
    });
  }

  clear() {
    this.user = null;
    this.usernameControl.reset();
    this.usernameControl.setValue("");
  }

}
