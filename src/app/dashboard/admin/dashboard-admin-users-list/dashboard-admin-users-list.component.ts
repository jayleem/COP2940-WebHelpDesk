import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard-admin-users-list',
  templateUrl: './dashboard-admin-users-list.component.html',
  styleUrls: ['./dashboard-admin-users-list.component.scss']
})
export class DashboardAdminUsersListComponent implements OnInit {
  //firestore subscription
  //
  public firestoreSubscriptions: Subscription[] = [];
  //firestore observable data
  //
  public users$;
  //errors
  //
  public errors;

  //data
  //
  public users = [];
  constructor(private issuesService: IssuesService, private userService: UserService) { }

  ngOnInit() {
    this.users$ = this.getUsers();
  }

  // Calls the getIssues method in issuesService for a list of documents from the firebase database collection
  // To get realtime data from Firestore we must use subscribe i.e. can't return a promise from
  //
  //
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
	  this.filterData();
    }));
    return this.users$ = users;
  }

  //Note the data here is filtered specifically for the table in users-list component
  //
  filterData() {
    this.users = [];
    this.users$.map(e => {
      //add only unique issues
      //
      if (!this.users.some(el => el.id === e.id)) {
        this.users.push(
          {
            id: e.userId,
            name: e.fName + " " + e.lName.slice(0,1) + '.',
            username: e.username,
            role: e.role,
            status: e.accountStatus ? "Enabled" : "Disabled",
          });        
        }
      });
    };

    //Calls the deleteIssue method in issuesService to delete a document from the firebase database collection
    //
    deleteIssue(event) {      
      const id = event.id;
      this.issuesService.deleteIssue(id)
        .then(res => {
          console.log(res);
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

  