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

    constructor(private router: Router, private fireAuthService: AuthService) { }

    canActivate(): boolean {
        this.fireAuthService.getLoggedIn().subscribe(res => {
            if (!res) {
                this.auth = true;
            } else {
                this.router.navigate(['/dashboard/home']);
                this.auth = false;
            }
        });
        return this.auth;
    }

    ngOnDestroy() {
        
     }
}
