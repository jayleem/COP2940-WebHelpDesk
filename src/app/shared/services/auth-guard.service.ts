//AuthGuardService
//Checks that a user is currently logged in
//

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private fireAuthService: AuthService) { }

  canActivate() {
    let auth;
    this.fireAuthService.getLoggedIn().subscribe(res => {
      if (!res) {
        this.router.navigate(['/login'])
        auth = false;
      } else {
        auth = true;
      }
    })
    return auth;
  }

  ngOnDestroy() { }
}
