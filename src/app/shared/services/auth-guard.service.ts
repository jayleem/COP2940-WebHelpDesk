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

  constructor(private router: Router, private authService: AuthService) { }

  async canActivate(): Promise<any> {
    //check if loggedIn
    return await this.authService.getLoggedIn().subscribe(res => {
      if (!res) {
        this.router.navigate(['/login']);
        return false;
      } else {
        //user logged in
        //update credentials from the users database
        this.authService.updateCreds();
        //logic user account hasn't been disabled
        //A user account cannot be disabled/enabled programmaticaly therefore we must disable the user in the users database
        //If a user account is disabled from the authorization console in Firebase then the account cannot login period
        //
        if (this.authService.getAccountStatus()) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }
    });
  }
  ngOnDestroy() { }
}
