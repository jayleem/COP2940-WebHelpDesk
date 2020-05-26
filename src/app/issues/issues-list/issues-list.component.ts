import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../shared/issues.service';
import { Issue } from '../../models/issue.model';
import { Subscription, throwError, Observable } from 'rxjs';
import { error } from 'protractor';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  //Priority
  //
  currentPriority; //default priority
  //Priority
  //
  currentStatus; //default status
  //Pagination
  //
  currentPage = 1;
  itemsPerPage = 10;
  pageSize: number;

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
    this.getIssues();
  }

  onPageChange(pageNum: number) {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  changePagesize(num: number) {
    this.itemsPerPage = this.pageSize + num;
  }


  // Calls the getIssues method in issuesService for a list of documents from the firebase database collection
  // To get realtime data from Firestore we must use subscribe instead of converting the query to a promise
  // If this looks weird idk what to say I usually work with Angular+Node and like my functions to be async promises :)
  getIssues() {
    this.firestoreSubscriptions.push(this.issuesService.getIssues().subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data.map(e => {
          console.log(e);
          return { id: e.payload.doc.id, ...e.payload.doc.data() as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
        console.error('ERROR: No documents were found');
        this.issues$ = undefined;
      }
    }));
  }

  getIssuesFiltered() {
    this.firestoreSubscriptions.push(this.issuesService.getIssuesFiltered(this.currentPriority, this.currentStatus).subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data;
        console.log(this.issues$);
      } else {
        this.errors = 'ERROR: No documents were found';
        console.error('ERROR: No documents were found');
        this.issues$ = undefined;
      }
    }));
  }


  //Calls the deleteIssue method in issuesService to delete a document from the firebase database collection
  //
  deleteIssue(id) {
    this.issuesService.deleteIssue(id);
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
