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

  constructor(private authService: AuthService, private route: Router) {
    this.loggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUser();
    console.log(this.user, this.loggedIn)
  }


  ngOnInit(): void { }

  signOut() {
    this.authService.signOut();
    console.log('clicked');
  }

  ngOnDestroy() {
    this.loggedIn.unsubscribe();
  }
}
