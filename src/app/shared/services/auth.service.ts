//AuthService
//Performs various authorization user login, registration, etc. 
//

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private firebaseAuth: AngularFireAuth, private userService: UserService, private router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        const data = {
          uid: user.uid,
          email: user.email,
          fName: '',
          lName: '',
          accountStatus: ''
        }
        this.setUser(data);//initial data values

        this.userService.getUserById(data.uid)
          .then(user => {
            this.user.fName = user[0].data.fName;
            this.user.lName = user[0].data.lName;
            this.setAccountStatus(user[0].data.accountStatus);
            this.setAccountRole(user[0].data.role);
            this.setUser(data);
            this.setLoggedIn(true);
          })
      }
    });
  }



  //Signup method
  //
  signUp(email: string, password: string): Promise<any> {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  //Sign in method
  //
  signIn(email: string, password: string): Promise<any>  {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  //signOut method
  //
  signOut(): Promise<any> {
    console.log('oof');
    this.setAccountStatus(false);
    this.setUser(null);
    this.setLoggedIn(false);
    //I'm using this to avoid the FirebaseError: [code=permission-denied] when the account is disabled while in use
    //This method is much easier than using a global subscription scope as my components already unsubscribe w/ ngOnDestroy
    //
    return this.firebaseAuth.signOut()
    .then(() => {
      window.location.reload();
      this.router.navigate(['/login']);      
    });
  }

  //resetPassword method
  //
  resetPassword(email: string): Promise<any> {
    return this.firebaseAuth.sendPasswordResetEmail(email);
  }

  //getUser method
  //
  getUser(): any {
    return this.user;
  }

  setUser(value) {
    this.user = value;
  }

  getAccountRole(): string {
    return this.user.role;
  }

  setAccountRole(value) {
    this.user.role = value;
  }

  getAccountStatus(): boolean {
    return this.user.accountStatus;
  }

  setAccountStatus(value) {
    this.user.accountStatus = value;
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
  getMetadata(): Promise<firebase.User> {
    return this.firebaseAuth.currentUser;
  }

  //reauthenticate user
  //must be async or it wil return a ZoneAwarePromise 
  //
  async reauthenticateUser(password: string): Promise<boolean> {
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
  async updatePassword(password: string): Promise<any> {
    const newPassword = password;
    const currentUser = this.firebaseAuth.currentUser
      .then(currentUser => {
        currentUser.updatePassword(newPassword);
        return "Success: Password Changed";
      })
      .catch(err => {
        return err;
      })
  }

  //method to check that the user credentials are still valid AFTER signing in and navigating around the app
  //important to set runGuardsandResolves:'always' on the appropiate routes.
  //
  async updateCreds(): Promise<any> {
    return await this.userService.getUserById(this.user.uid)
      .then(user => {
        this.setAccountStatus(user[0].data.accountStatus);
        this.setAccountRole(user[0].data.role);
      });
  }
}
