
import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'AngularBibli';

  constructor() {

    const config = {
      apiKey: "AIzaSyApnMvwlnFkHBKPi3FjNb3QU1a4vvM9uhw",
      authDomain: "angularbibli.firebaseapp.com",
      databaseURL: 'https://angularbibli-default-rtdb.europe-west1.firebasedatabase.app/',
      projectId: "angularbibli",
      storageBucket: "angularbibli.appspot.com",
      messagingSenderId: "683572639147",
      appId: "1:683572639147:web:30f9ff7e40446aca6b0eee",
      measurementId: "G-CBFTC7YSSX"
    };
    firebase.default.initializeApp(config);
  }
}
