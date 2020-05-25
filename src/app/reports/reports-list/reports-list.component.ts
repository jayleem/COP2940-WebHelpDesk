import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { IssuesService } from 'src/app/shared/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Issue } from 'src/app/models/issue.model';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent implements OnInit {
  //firestore subscription
  //
  firestoreSubscription: Subscription;
  tech: string;
  issues$;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.tech = this.route.snapshot.paramMap.get('tech');
    this.getIssueByTech(this.tech);
  }

  getIssueByTech(tech) {
    this.firestoreSubscription = this.issuesService.getIssuesByTech(tech).subscribe(data => {
      this.issues$ = data.map(e => {
        console.log(e);
        return { id: e.id, ...e as {}} as Issue;
      })
    });
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    this.firestoreSubscription.unsubscribe();
  }

}
