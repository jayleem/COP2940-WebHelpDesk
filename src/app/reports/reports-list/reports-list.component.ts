import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/shared/issues.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
})
export class ReportsListComponent implements OnInit {
  tech: string;
  issues$: any;
  errors: any;
  paramSubs;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.paramSubs = this.route.params
      .subscribe(
        (params: Params) => {
          this.tech = params['tech'];
          this.getIssueByTech(this.tech);
        }
      );
  }

  ngOnDestroy() {
    this.paramSubs.unsubscribe();
  }

  async getIssueByTech(tech) {
    await this.issuesService.getIssuesByTech(tech)
      .then(res => {
        this.issues$ = res;
      })
      .catch(err => {
        this.issues$ = undefined;
        this.errors = err;
      })
  }
}
