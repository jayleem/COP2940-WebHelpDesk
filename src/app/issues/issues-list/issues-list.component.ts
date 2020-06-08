import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
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
  constructor(private issuesService: IssuesService, private authService: AuthService, private userService: UserService, private router: Router) {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
        this.name = res[0].data.fName + " " + res[0].data.lName;
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
    this.getIssuesByTech();
  }  

  getIssuesByTech() {
    const tech = this.user.email;
    this.issuesService.getIssuesByTech(tech)
    .then(data => {
      if (data.length > 0) {
        this.issues$ = data.map(e => {
          return { id: e.id, ...e.data as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
        this.issues$ = undefined;
      }
      this.filterData();
    });
  }

  getIssuesFiltered(priority, status) {
    this.issuesService.getIssuesFiltered(priority, status)
    .then(issues => {
      if (issues.length > 0) {
        this.issues$ = issues.map(e => {
          return { id: e.id, ...e.data as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
      }
      this.filterData();
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
            tech: e.tech,
            priority: e.priority,
            status: e.status,
            dateStart: e.dateStart,
            dateEnd: e.dateEnd,
            //summary: e.desc.summary
          });        
        }
      });
    }

  //Note the data here is filtered specifically for the table in issues-list component
  //
    filtersChanged(event) {
      if (event.filters) {
        this.getIssuesFiltered(event.filters.currentPriority, event.filters.currentStatus);
      } else {
        this.getIssuesByTech()
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
          this.getIssuesByTech();
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
