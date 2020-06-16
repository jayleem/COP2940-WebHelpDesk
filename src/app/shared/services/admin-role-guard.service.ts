import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuardService {
  private user: any;
  
  constructor(private router: Router, private fireAuthService: AuthService) {}
  
  canActivate():boolean {
    this.user = this.fireAuthService.getUser();
   
    //non admin users get redirected to the 404 page
    //I decided to redirect non authorized users to the 404 page instead of displaying errors
    if(this.user.role == 'admin') {
      return true;
    } else {
      this.router.navigate(['/404']);
      return false;
    }
  }

  ngOnDestroy() {}
}
