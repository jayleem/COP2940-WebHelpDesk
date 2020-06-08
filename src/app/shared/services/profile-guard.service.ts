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
  private auth: boolean;

  constructor(private router: Router, private fireAuthService: AuthService) { }

  canActivate(route: ActivatedRoute, state: RouterStateSnapshot): boolean {
    let id = route.url[1].path;
    this.fireAuthService.getMetadata()
      .then(res => {
        if (res.uid === id) {
          this.auth = true;
        } else {
          this.auth = false;
          this.router.navigate(['/dashboard/home']);
        }
      })
      .catch(err => {
        this.auth = false;
      })
    return this.auth;
  }

  ngOnDestroy() { }
}
