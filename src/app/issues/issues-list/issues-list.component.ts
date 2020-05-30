import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/issues.service';
import { Issue } from 'src/app/models/issue.model';

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
  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
    this.issues$ = this.getIssues();
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

  getIssuesFiltered(priority, status) {
    this.firestoreSubscriptions.push(this.issuesService.getIssuesFiltered(priority, status).subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data;
      } else {
        this.errors = 'ERROR: No documents were found';
      }
      this.filterData();
    }));
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
            dateEnd: e.dateEnd
          });        
        }
      });
    };

    filtersChanged(event) {
      if (event.filters) {
        this.getIssuesFiltered(event.filters.currentPriority, event.filters.currentStatus);
      } else {
        this.getIssues()
      }
    }

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
