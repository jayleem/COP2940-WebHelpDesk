import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
