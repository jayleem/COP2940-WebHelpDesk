import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})

export class ReportsListComponent implements OnInit {
  issues$;
  issues;
  id;
  errors;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  getIssues() {
    this.issuesService.getIssuesByTech(this.id)
      .then(issues => {
        if (issues.length > 0) {
          this.issues$ = issues;
        } else {
          this.errors = 'ERROR: No documents were found';
        }
        this.filterData();
      })
  }

  filterData() {
    this.issues = [];
    this.issues$.map(e => {
      //add only unique open issues
      //
      if (!this.issues.some(el => el.id === e.id) && e.data.status === 'Open') {
        this.issues.push(
          {
            id: e.id,
            title: e.data.title,
            tech: e.data.tech,
            priority: e.data.priority,
            status: e.data.status,
            dateStart: e.data.dateStart,
            dateEnd: e.data.dateEnd
          });
      }
    });
  };

  ngOnInit() {
    this.issues$ = this.getIssues();
  }

}