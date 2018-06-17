import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {

  /**Model dell'utente di cui visualizzare le informazioni.*/
  @Input() user: User;

  constructor() { }

}
