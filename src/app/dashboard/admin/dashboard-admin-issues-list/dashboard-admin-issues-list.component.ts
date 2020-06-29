import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
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
  //messages
  //
  public error;
  public success;
  //data
  //
  public issues = [];
  public newIssues = [];
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
        //no users found
      });
    // Calls the getIssues method in issuesService for a list of documents from the firebase database collection
    // To get realtime data from Firestore we must use subscribe i.e. can't return a promise from
    //

  }

  ngOnInit() {
    this.getUsers();
    this.getIssues();
  }

  //gets the original issues$ data
  //
  getIssues() {
    this.firestoreSubscriptions.push(this.issuesService.getAggregation().subscribe(data => {
      let dataArr = [];
      if (data.length > 0) {
        this.issues$ = data.map((e) => {
          const data: any = e.payload.doc.data() as Issue;
          dataArr.push(...data.issues);
        });
      } else {
        this.error = 'ERROR: No documents were found';
        this.issues$ = null;
        this.issues = null;
      }
      this.issues$ = dataArr;
      this.filterData();
      return dataArr;
    }));
  }

    //TO-DO implement aggregation for users as well
  //gets users currently doesn't use the same aggregation as issues
  //
  getUsers() {
    let users = [];
    this.firestoreSubscriptions.push(this.userService.getUsers().subscribe(data => {
      if (data.length > 0) {
        data.map(user => {
          if (user.payload.doc.data().role != 'admin') {
            users.push({ id: user.payload.doc.id, ...user.payload.doc.data() as {} } as User);
          }
        });
      } else {
        this.error = ('ERROR: No documents were found');
        users = [];
      }
    }));
    return this.users$ = users;
  }

  // "filterData" is probabaly not the best name for this function, but it filters/strips unncessary data for the dynamic table component
  // 
  filterData() {
    this.issues = [];
    this.issues$.map(e => {
      //add only unique issues
      //
      if (!this.issues.some(el => el.id === e.id)) {
        const index = this.users$.findIndex(el => el.username === e.assignedTech)
        let userObj = this.users$[index];
        if (index >= 0) {
          this.issues.push(
            {
              id: e.id,
              title: e.title,
              tech: e.assignedTech,
              name: userObj ? userObj.fName + ' ' + userObj.lName.slice(0, 1) + '.' : e.assignedTech,
              status: e.status,
              priority: e.priority,
              severity: e.severity,
              difficulty: e.difficulty,
              dateStart: e.dateStart,
              dateEnd: e.dateEnd
            });
        }
      }
    });
    this.newIssues = this.issues;
  };

  //bakes the retrieved data for client view using array filter which reduces cost by not needing additional queries
  //
  getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy) {
    this.newIssues = this.issues;

    if (tech) {
      this.newIssues = this.issues.filter((issue: any) => issue.tech == tech)
    };
    if (status) {
      this.newIssues = this.issues.filter((issue: any) => issue.status == status)
    };
    if (priority) {
      this.newIssues = this.issues.filter((issue: any) => issue.priority == priority)
    };
    if (severity) {
      this.newIssues = this.issues.filter((issue: any) => issue.severity == severity)
    };
    if (difficulty) {
      this.newIssues = this.issues.filter((issue: any) => issue.difficulty == difficulty)
    };
    if (orderBy) {
      if (orderBy != "priority") {
        this.newIssues = this.newIssues.sort((a, b) => (a.severity.toUpperCase() < b.severity.toUpperCase()) ? -1 : (a.severity.toUpperCase() > b.severity.toUpperCase()) ? 1 : 0);
      } else {
        this.newIssues = this.newIssues.sort((a, b) => (a.priority.toUpperCase() < b.priority.toUpperCase()) ? -1 : (a.priority.toUpperCase() > b.priority.toUpperCase()) ? 1 : 0);
      }
    };
  }


  //detects changes from a user changing the different filters status, priority, etc.
  //
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
        this.success = res;
        this.userService.updateUserHistory(this.user.uid, "Deleted", id);
        setTimeout(() => { this.error, this.success = '' }, 3000);
      })
      .catch(err => {
        this.error = (`ERROR: Document with id ${id} could not be deleted.`);
      });
  }
  // Unsubscribes each subscription in the firestoreSubscriptions array to remove the real time listeners
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
