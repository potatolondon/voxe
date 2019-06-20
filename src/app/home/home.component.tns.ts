import { Component, OnInit } from '@angular/core';

const firebase = require('nativescript-plugin-firebase/app');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'voxe';
  todos: any[] = [];

  constructor() {
    const fbPromise = firebase.firestore().collection('todos');

    fbPromise.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(`${doc.id} => ${doc.data().content}`);
        this.todos.push(doc.data());
      });
    });

  }

  ngOnInit() {
  }
}
