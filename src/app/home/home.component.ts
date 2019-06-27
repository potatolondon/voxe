import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FirestoreService } from '../firestore/firestore.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public todos$: Observable<any>;
  public addTodoText = '';
  protected collectionName = 'todos';

  constructor(
    protected firestore: FirestoreService,
    protected auth: AuthService,
  ) {
  }

  public ngOnInit() {
    this.todos$ = this.firestore.valueChanges(this.collectionName, null, {
      where: [{
        field: 'userId',
        comparator: '==',
        value: this.auth.user.uid
      }],
      orderBy: [{
        field: 'createdAt',
        direction: 'asc'
      }]
    });
  }

  public async onAddItem() {
    await this.firestore.createDoc(this.collectionName, {
      content: this.addTodoText,
      userId: this.auth.user.uid,
      createdAt: Date.now()
    });
    this.addTodoText = '';
  }

  public onDeleteItem(documentId) {
    this.firestore.deleteDoc(this.collectionName, documentId);
  }
}
