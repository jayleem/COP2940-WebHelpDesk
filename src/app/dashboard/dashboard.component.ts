import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  //user data
  //
  user: any;
  role: any;
  subMenu0 = false;
  subMenu1 = false;
  subMenu2 = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
      })
      .catch(err => {
        console.log(err);
      });
  }

  setIssueCount(event: any) {
    console.log("testing");
    console.log(event);
  }

  ngOnInit() { }
}
