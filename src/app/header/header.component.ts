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

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getLoggedIn().subscribe(res => {
      this.loggedIn = res;
      if (this.loggedIn) {
        this.user = this.authService.getUser();
      }
    });
  }


  ngOnInit(): void { }

  signOut() {
    this.authService.signOut()
      .then(res => {
        console.log(res);
        this.router.navigate(['login']);
      })
      .catch(err => {
        console.log(err);
      })
  }

  ngOnDestroy() {
    this.loggedIn.unsubscribe();
  }
}
