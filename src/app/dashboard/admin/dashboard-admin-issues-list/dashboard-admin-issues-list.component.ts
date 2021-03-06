import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard-admin-issues-list',
  templateUrl: './dashboard-admin-issues-list.component.html',
  styleUrls: ['./dashboard-admin-issues-list.component.scss']
})
export class DashboardAdminIssuesListComponent implements OnInit {
  //firestore subscription
  //
  public firestoreSubscriptions: Subscription[] = [];
  //firestore observable data
  //
  public issues$;
  public users$;
  //errors
  //
  public errors;

  //data
  //
  public issues = [];
  //Get user and role
  //I don't think this is a very good way of doing things. I should just bind the user and role to data from the parent component.
  //
  user: any;
  role: any;
  name: any;
  recentHistory: any;
  constructor(private issuesService: IssuesService, private authService: AuthService, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
        this.name = res[0].data.fName + " " + res[0].data.lName;
        this.recentHistory = res[0].data.recentHistory;
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
    this.getUsers();
    this.getIssues();//default view get all issues
  }

  // Calls the getIssues method in issuesService for a list of documents from the firebase database collection
  // To get realtime data from Firestore we must use subscribe i.e. can't return a promise from
  //
  //
  getIssues() {
    this.firestoreSubscriptions.push(this.issuesService.getIssues().subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data.map(e => {
          return { id: e.payload.doc.id, ...e.payload.doc.data() as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
        this.issues$ = undefined;
      }
      this.filterData();
    }));
  }

  getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy) {
    this.issuesService.getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy)
      .then(issues => {
        if (issues.length > 0) {
          this.issues$ = issues.map(e => {
            return { id: e.id, ...e.data as {} } as Issue;
          });
        } else {
          this.errors = 'ERROR: No documents were found';
          this.issues = [];
        }
        this.filterData();
      })
      .catch(err => {
        this.errors = 'ERROR: No documents were found';
        this.issues = [];
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

  //Note the data here is filtered specifically for the table in issues-list component
  //
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
            difficulty: e.difficulty,
            status: e.status,
            dateStart: e.dateStart,
            dateEnd: e.dateEnd
          });
      }
    });
  };

  filtersChanged(event) {
    if (event.filters) {
      this.getIssuesOrdered(
        event.filters.currentTech,
        event.filters.currentStatus,
        event.filters.currentPriority,
        event.filters.currentSeverity,
        event.filters.currentDifficulty,
        event.filters.orderBy);
    } else {
      this.getIssues();
    }
  }

  //Calls the deleteIssue method in issuesService to delete a document from the firebase database collection
  //
  deleteIssue(event) {
    const id = event.id;
    this.issuesService.deleteIssue(id)
      .then(res => {
        console.log(res);
        this.userService.updateUserHistory(this.user.uid, "Deleted", id);
        this.getIssues();
      })
      .catch(err => {
        console.log(err);
      });
  }


  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
