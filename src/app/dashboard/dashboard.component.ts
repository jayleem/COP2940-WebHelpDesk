import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  role: any;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
  }
}
