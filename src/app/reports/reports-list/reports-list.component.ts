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
    let dataArr = [];
    this.issuesService.getAggregation().subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data.map(e => {
          const data: any = e.payload.doc.data() as Issue;
          dataArr.push(...data.issues);
          return dataArr;
        });
      } else {
        this.issues$ = undefined;
      }
      this.errors = ''
      this.issues$ = dataArr;
    });
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
            tech: e.data.assignedTech,
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