import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [{title:'Hello', author: 'Robin', photo: '', synopsis:''}];
  booksSubject = new Subject<Book[]>();

  constructor() {
    this.getBooks();
  } 

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.default.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.default.database().ref('/books')
      .on('value', (data: DataSnapshot) => {
          this.books = data.val() ? data.val() : [];
          this.emitBooks();
        }
      );
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.default.database().ref('/books/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  

  removeBook(book: Book) {
    if(book.photo) {
      const storageRef = firebase.default.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
        else {return false}
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.default.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.default.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
  
}
