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

    constructor(private router: Router, private fireAuthService: AuthService) { }

    canActivate() {
        let auth;
        this.fireAuthService.getLoggedIn().subscribe(res => {
            if (!res) {
                auth = true;
            } else {
                this.router.navigate(['/dashboard/home']);
                auth = false;
            }
        });
        return auth;
    }

    ngOnDestroy() {
        
     }
}
