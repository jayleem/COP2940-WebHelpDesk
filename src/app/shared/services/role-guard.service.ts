import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  private user: any;
  private authorizedRoles = ["admin", "t1", "t2", "t3"];

  constructor(private router: Router, private fireAuthService: AuthService) {
  }

  async canActivate(): Promise<any> {
    this.user = await this.fireAuthService.getUser();
    const role = this.user.role;
    if (this.authorizedRoles.includes(role)) {
      return true;
    } else {
      this.router.navigate(['/role-assignment'])
      return false;
    }
  }

  ngOnDestroy() { }
}
