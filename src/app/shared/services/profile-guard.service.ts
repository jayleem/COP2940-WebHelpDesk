//ProfileGuardService
//Checks that the destination profile id matches the currently logged in user id
//

import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RouterState, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuardService {

  constructor(private router: Router, private fireAuthService: AuthService) { }

  canActivate(route: ActivatedRoute, state: RouterStateSnapshot) {
    let id = route.url[1].path;
    let auth = this.fireAuthService.getMetadata()
      .then(res => {
        if (res.uid === id) {
          return true;
        } else {
          return false;
        }
      })
      .catch(err => {
        return false;
      })
    return auth;
  }

  ngOnDestroy() { }
}
