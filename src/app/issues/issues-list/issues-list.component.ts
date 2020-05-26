import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../shared/issues.service';
import { Issue } from '../../models/issue.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  //Priority
  //
  currentPriority; //default priority
  //Status
  //
  currentStatus; //default status
  //Pagination
  //
  currentPage = 1;
  itemsPerPage = 10;
  pageSize = 0;
  //firestore subscription
  //
  firestoreSubscriptions: Subscription[] = [];
  issues$;
  errors;

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
    this.issues$ = this.getIssues();
  }

  changePriority(change: string) {
    this.currentPriority = change;
  }

  changeStatus(change: string) {
    this.currentStatus = change;
  }

  applyFilters() {
    this.getIssuesFiltered();
  }

  clearFilters() {
    this.currentPriority = null;
    this.currentStatus = null;
    this.errors = null;
    this.getIssues();
  }

  onPageChange(change: number) {
    this.pageSize = this.itemsPerPage * (change - 1);
  }

  changePagesize(change: string) {
    this.itemsPerPage = this.pageSize + parseInt(change);
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
    }));
  }

  getIssuesFiltered() {
    this.firestoreSubscriptions.push(this.issuesService.getIssuesFiltered(this.currentPriority, this.currentStatus).subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data;
        console.log('Data', data);
      } else {
        console.log('Data', data);
        this.errors = 'ERROR: No documents were found';
      }
    }));
  }


  //Calls the deleteIssue method in issuesService to delete a document from the firebase database collection
  //
  deleteIssue(id) {
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
