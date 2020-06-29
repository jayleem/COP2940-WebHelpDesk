import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IssuesService } from '../shared/services/issues.service';
import { Subscription } from 'rxjs';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  //user data
  //
  user: any;
  role: any;
  //vars for expanding/collapsing dropdown menus
  //
  subMenu0 = true;
  subMenu1 = true;
  //vars for expanding/collapsing sidebar
  //
  sidebarToggle = true;
  constructor(private authService: AuthService, private userService: UserService, private issuesService: IssuesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
      })
      .catch(err => {
       //no user found
      });
  }
}
