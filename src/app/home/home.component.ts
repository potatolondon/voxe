import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'voxe';
  todos: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.todos = db.collection('todos').valueChanges();

    this.todos.subscribe((todo) => console.log(todo));
  }

  ngOnInit() {
  }
}
