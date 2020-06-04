import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuardService {

    constructor(private router: Router, private fireAuthService: AuthService) { }

    async canActivate() {
        let auth;
        await this.fireAuthService.getLoggedIn().subscribe(res => {
            if (!res) {
                auth = true;
            } else {
                this.router.navigate(['issues/dashboard']);
                auth = false;
            }
        });
        return auth;
    }


    ngOnDestroy() {
        
     }
}
