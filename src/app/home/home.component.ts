import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FirestoreService } from '../firestore/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public todos$: Observable<any>;
  public addTodoText = '';
  protected collectionName = 'todos';

  constructor(protected firestore: FirestoreService) {
  }

  public ngOnInit() {
    this.todos$ = this.firestore.valueChanges(this.collectionName);
  }

  public async onAddItem() {
    await this.firestore.createDoc(this.collectionName, { content: this.addTodoText });
    this.addTodoText = '';
  }

  public onDeleteItem(documentId) {
    this.firestore.deleteDoc(this.collectionName, documentId);
  }
}
