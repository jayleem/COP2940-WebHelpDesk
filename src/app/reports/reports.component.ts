import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IssuesService } from '../shared/services/issues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { Issue } from '../models/issue.model';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  //firestore subscription
  //
  firestoreSubscriptions: Subscription[] = [];

  //issues
  //
  issues$;
  users$;
  issues;
  errors;

  newIssueForm: FormGroup;

  //query vars
  //
  public reportType;
  public tech;
  public status;
  public priority;
  public severity;
  public difficulty;
  public orderBy;
  constructor(private issueService: IssuesService, private router: Router, private route: ActivatedRoute, private issuesService: IssuesService, private userService: UserService, private fireAuthService: AuthService) { }

  //current user;
  //
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.fireAuthService.getUser();
    //get users
    //
    this.getUsers();
    //get query parameters
    //
    this.route.queryParams.subscribe(queryParams => {
      this.reportType = queryParams.reportType;
      this.tech = queryParams.tech;
      this.status = queryParams.status;
      this.priority = queryParams.priority;
      this.severity = queryParams.severity;
      this.difficulty = queryParams.difficulty;
      this.orderBy = queryParams.orderBy;
      if (this.reportType != "search") {
        this.getIssuesOrdered(this.tech, this.status, this.priority, this.severity, this.difficulty, this.orderBy)
      } else {
        this.issues = null;
        this.reportType = queryParams.reportType;
      }
    });
    this.newIssueForm = new FormGroup({
      'reportData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
      })
    });
  }

  ticketStats = {
    status: {
      open: 0,
      pending: 0,
      closed: 0,
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    }
  };
  techs = [];
  generateOverviewReport() {
    //reset the vars
    //
    this.ticketStats.status.open = 0;
    this.ticketStats.status.pending = 0;
    this.ticketStats.status.closed = 0;
    this.ticketStats.status.low = 0;
    this.ticketStats.status.medium = 0;
    this.ticketStats.status.high = 0;
    this.ticketStats.status.urgent = 0;
    this.techs = []

    //map issue data
    //may lead to performance issues but theres no way to count firebase documents
    //could also write more efficient code here but i'm not getting paid for this 
    //
    this.issues$.map(e => {
      //add only unique technicans
      //
      if (!this.techs.some(el => el.tech === e.assignedTech)) {
        const index = this.users$.findIndex(el => el.username === e.assignedTech)
        let userObj = this.users$[index];
        this.techs.push(
          {
            tech: e.assignedTech,
            name: userObj ? userObj.fName + ' ' + userObj.lName.slice(0, 1) + '.' : e.assignedTech,
            open: 0,
            pending: 0,
            closed: 0,
            low: 0,
            medium: 0,
            high: 0,
            urgent: 0
          });
      }

      //get index of current tech on issue
      //
      const index = this.techs.findIndex(el => el.tech === e.assignedTech)
      let techObj = this.techs[index];
      if (e.assignedTech === techObj.tech && e.status === 'Open') {
        this.techs[index].open++;
        this.ticketStats.status.open++;
      }
      if (e.assignedTech === techObj.tech && e.status === 'Pending') {
        this.techs[index].pending++;
        this.ticketStats.status.pending++;
      }
      if (e.assignedTech === techObj.tech && e.status === 'Closed') {
        this.techs[index].closed++;
        this.ticketStats.status.closed++;
      }
      if (e.priority === 'Low') {
        this.techs[index].low++;
        this.ticketStats.status.low++;
      } else if (e.priority === 'Medium') {
        this.techs[index].medium++;
        this.ticketStats.status.medium++;
      } else if (e.priority === 'High') {
        this.techs[index].high++;
        this.ticketStats.status.high++;
      } else {
        this.techs[index].urgent++;
        this.ticketStats.status.urgent++;
      }
    });
  }

   getUsers() {
    let users = [];
    this.firestoreSubscriptions.push(this.userService.getUsers().subscribe(data => {
      if (data.length > 0) {
        data.map(user => {
			 if (user.payload.doc.data().accountStatus == true && user.payload.doc.data().role != 'admin') {
          users.push({ id: user.payload.doc.id, ...user.payload.doc.data() as {} } as User);
			 }
        });
      } else {
        this.errors.push('ERROR: No documents were found');
        users = [];
      }
    }));
    return this.users$ = users;
  }

  getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy) {
    this.issuesService.getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy)
      .then(issues => {
        if (issues.length > 0) {
          this.issues$ = issues.map(e => {
            return { id: e.id, ...e.data as {} } as Issue;
          });
        };
        this.errors = '';
        this.filterData();
      })
      .catch(err => {
        console.log(err);
        this.issues = [];
        this.errors = 'ERROR: No documents were found';
      });
  }

  filterData() {
    this.issues = [];
    this.issues$.map(e => {
      //add only unique issues
      //
      if (!this.issues.some(el => el.id === e.id)) {
        const index = this.users$.findIndex(el => el.username === e.assignedTech)
        let userObj = this.users$[index];
        this.issues.push(
          {
            id: e.id,
            title: e.title,
            tech: e.assignedTech,
            name: userObj ? userObj.fName + ' ' + userObj.lName.slice(0, 1) + '.' : e.assignedTech,
            priority: e.priority,
            severity: e.severity,
            status: e.status,
            difficulty: e.difficulty,
            dateStart: e.dateStart,
            dateEnd: e.dateEnd,
            //summary: e.desc.summary
          });
      }
    });
    this.generateOverviewReport();
  }

  //used for search report
  //
  onSubmit() {
    const tech = this.newIssueForm.value.reportData.tech;
    this.getIssuesOrdered(tech, this.status, this.priority, this.severity, this.difficulty, this.orderBy);
  }
}
