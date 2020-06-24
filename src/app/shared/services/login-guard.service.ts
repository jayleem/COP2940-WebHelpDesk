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
                //can access login page
                //
                this.auth = true;
            } else {
                //redirect user away from login page based on role to correct dashboard component
                //
                let role:string = this.authService.getAccountRole();
                let status:boolean = this.authService.getAccountStatus();
                if (status && role =='admin') {
                    this.router.navigate(['/dashboard/admin/home']);
                }
                else if (status && role !='admin') {
                    this.router.navigate(['/dashboard/home']);
                }
                else if  (!status || role !='unassigned') {
                    //something not right  
                    this.router.navigate(['/role-assignment']);                 
                } else {
                    this.router.navigate(['/login']);                 
                }
                this.auth = false;
            }
        });
        return this.auth;
    }

    ngOnDestroy() {

    }
}
