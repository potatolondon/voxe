import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public title = 'voxe';
  public todos: Observable<any>;

  constructor(protected firebase: FirebaseService) {
  }

  ngOnInit() {
    this.todos = this.firebase.valueChanges('todos');
  }
}
