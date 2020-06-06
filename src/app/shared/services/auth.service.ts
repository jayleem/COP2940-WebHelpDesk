//AuthService
//Performs various authorization user login, registration, etc. 
//

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new Subject<any>();
  private loggedIn = new BehaviorSubject<boolean>(false);
  private accountStatus;

  constructor(private firebaseAuth: AngularFireAuth, private userService: UserService, private router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        const data = {
          uid: user.uid,
          email: user.email
        }
        this.userService.getUserById(data.uid)
          .then(user => {
            if (user[0].data.accountStatus === 'enabled') {
              this.setAccountStatus(user[0].data.accountStatus);
              this.setUser(data);
              this.setLoggedIn(true);
            } else {
              this.setAccountStatus('disabled');
              this.setLoggedIn(false);
              this.setUser(null);
              this.signOut();
            }
          });
      } else {
        this.setAccountStatus('disabled');
        this.setLoggedIn(false);
        this.setUser(null);
        this.signOut(); 
      }
    })
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

  getAccountStatus() {
    return this.accountStatus;
  }

  setAccountStatus(value) {
    this.accountStatus = value;
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
  //must be async or it wil return a ZoneAwarePromise 
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

  //update user password
  //
  async updatePassword(password: string) {
    const newPassword = password;
    const currentUser = await this.firebaseAuth.currentUser
      .then(currentUser => {
        currentUser.updatePassword(newPassword);
        return "Success: Password Changed";
      })
      .catch(err => {
        return err;
      })
  }

}
