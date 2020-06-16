//AuthGuardService
//Checks that a user is currently logged in
//

import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private fireAuthService: AuthService) { }

  async canActivate(): Promise<any> {
    //check if loggedIn
    return await this.fireAuthService.getLoggedIn().subscribe(res => {
      if (!res) {
        //user not logged in
        //
        this.router.navigate(['/login']);
        return false;
      } else {
        //user logged in
        //
        this.fireAuthService.updateCreds(); //update credentials from the users database
        //check if user account is still enabled
        //
        if (this.fireAuthService.getAccountStatus()) {
          return true;
        } else {
          this.fireAuthService.signOut();
          return false;
        }
      }
    });
  }
  ngOnDestroy() { }
}
