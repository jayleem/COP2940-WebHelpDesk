import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  private loggedIn: any;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email
        }
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
        this.user = false;
      }
    });
  }

  //Signup method
  //
  signUp(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const result = this.firebaseAuth.createUserWithEmailAndPassword(email, password);
      if (!result) {
        reject('Register user failed')
      } else {
        resolve(result);
      }
    });
  }

  //Sign in method
  //
  signIn(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const result = this.firebaseAuth.signInWithEmailAndPassword(email, password);
      if (!result) {
        reject('Login failed')
      } else {
        resolve(result);
      }
    });
  }

  //signOut method
  //
  signOut() {
    this.firebaseAuth.signOut()
      .then(res => {
        console.log('User signed out')
        return this.router.navigate(['/login'])
      })
      .catch(err => {
        console.log(err)
      })
  }

  //resetPassword method
  //
  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      const result = this.firebaseAuth.sendPasswordResetEmail(email);
      if (!result) {
        reject('Reset failed')
      } else {
        resolve(result);
      }
    });
  }

  //getUser method
  getUser() {
    return this.user;
  }
  //getUser method
  isLoggedIn() {
    return this.loggedIn;
  }
}
