import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

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
    this.getIssues();
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
       this.errors = '';
       this.filterData();
      } else {
        this.issues = [];
        this.errors = 'ERROR: No results found';
      }
    }));         
  }

  getIssuesFiltered(status, priority, severity, difficulty) {
    this.issuesService.getIssuesFiltered(status, priority, severity, difficulty)
    .then(issues => {
      if (issues.length > 0) {
        this.issues$ = issues.map(e => {
          return { id: e.id, ...e.data as {} } as Issue;
        });
        this.errors = '';
        this.filterData();
      } else {
        this.issues = [];
        this.errors = 'ERROR: No results found';
      }
    })
    .catch(err => {
      this.issues = [];
      this.errors = 'ERROR: No results found';
    });
  }

  //Note the data here is filtered specifically for the table in issues-list component
  //
  filterData() {
    this.issues = [];
    this.issues$.map(e => {
      //add only unique issues
      //
      if (!this.issues.some(el => el.id === e.id)) {
        this.issues.push(
          {
            id: e.id,
            title: e.title,
            tech: e.assignedTech,
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
        this.getIssuesFiltered(event.filters.currentStatus, event.filters.currentPriority, event.filters.currentSeverity, event.filters.currentDifficulty)
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
