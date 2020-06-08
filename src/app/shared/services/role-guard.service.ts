import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  private user: any;
  
  constructor(private router: Router, private fireAuthService: AuthService) {}
  
  canActivate():boolean {
    this.user = this.fireAuthService.getUser();
   
    if(this.user.role == 'admin') {
      console.log("is admin");
      return true;
    } else {
      this.router.navigate(['/dashboard/home']);
      return false;
    }
  }

  ngOnDestroy() {}
}
