import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private fireAuthService: AuthService) { }

  canActivate(): boolean {
    if (!this.fireAuthService.getUser()) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
