//LoginGuardService
//Redirects users who are already logged in away from the /login and /register routes
//
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuardService {
    private auth: boolean;

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(): boolean {
        this.authService.getLoggedIn().subscribe(res => {
            if (!res) {
                this.auth = true;
            } else {
                //redirect user based on role to correct dashboard component
                //
                let role = this.authService.getAccountRole(); 
                if (role != 'admin') {
                    this.router.navigate(['/dashboard/home']);                                        
                } else {
                    this.router.navigate(['/dashboard/admin/home']);            
                }
                this.auth = false;
            }
        });
        return this.auth;
    }

    ngOnDestroy() {
        
     }
}
