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
  //firestore subscription
  //
  firestoreSubscription: Subscription;
  issues$;

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
    this.issues$ = this.getIssues();
  }

  //Calls the getIssues method in issuesService for a list of documents from the firebase database collection
  //
  getIssues() {
    this.firestoreSubscription = this.issuesService.getIssues().subscribe(data => {
      this.issues$ = data.map(e => {
        return { id: e.payload.doc.id, ...e.payload.doc.data() as {}} as Issue;
      })
    });
  }

  //Calls the deleteIssue method in issuesService to delete a document from the firebase database collection
  //
  deleteIssue(id) {
    this.issuesService.deleteIssue(id);   
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    this.firestoreSubscription.unsubscribe();
  }
}
