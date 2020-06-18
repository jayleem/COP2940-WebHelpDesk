import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  isCollapsed = false;
  loggedIn: any;
  user: any;
  role: any;
  url: string;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getLoggedIn().subscribe(res => {
      this.loggedIn = res;
      if (this.loggedIn) {
        this.user = this.authService.getUser();
        this.role = this.authService.getAccountRole();
        this.url = this.setUrl();
      }
    });
  }

  setUrl() {
    if (this.role === 'admin') {
      return 'dashboard/admin/home';
    } else {
      return 'dashboard/home';
    }
  }


  ngOnInit(): void { }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.loggedIn.unsubscribe();
  }
}
