//AuthService
//Performs various authorization user login, registration, etc. 
//

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new Subject<any>();
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        const data = {
          uid: user.uid,
          email: user.email
        }
        this.setUser(data);
        this.setLoggedIn(true);
      } else {
        this.setLoggedIn(false);
        this.setUser(null);
      }
    });
  }

  //Signup method
  //
  signUp(email: string, password: string) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  //Sign in method
  //
  signIn(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  //signOut method
  //
  signOut() {
    return this.firebaseAuth.signOut();
  }

  //resetPassword method
  //
  resetPassword(email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email);
  }

  //getUser method
  //
  getUser() {
    return this.user;
  }

  setUser(value) {
    this.user = value;
  }

  //getUser method
  //
  getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setLoggedIn(value: boolean) {
    return this.loggedIn.next(value);
  }

  //get user meta data
  //
  getMetadata() {
    return this.firebaseAuth.currentUser;
  }

  //reauthenticate user
  //must be async or it wil return a zone aware promise
  //
  async reauthenticateUser(password: string) {
    const username = await this.firebaseAuth.currentUser.then(res => { return res.email });
    const oldPassword = password;

    let reauthenticated = this.firebaseAuth.signInWithEmailAndPassword(username, oldPassword)
      .then(res => {
        return true;
      })
      .catch(err => {
        return false;
      })

    return reauthenticated;
  }
}
