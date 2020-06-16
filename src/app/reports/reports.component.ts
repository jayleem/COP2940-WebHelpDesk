import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IssuesService } from '../shared/services/issues.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  //issues
  //
  issues$;
  issues;
  errors;
  //order data
  //
  orderBy;
  //report type
  //
  reportType;

  newIssueForm: FormGroup;

  constructor(private issueService: IssuesService, private router: Router, private route: ActivatedRoute, private issuesService: IssuesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.reportType === "ordered") {
        this.reportType = queryParams.reportType;
        this.issues = null;
        this.getIssuesOrdered(queryParams.tech, queryParams.status, queryParams.priority, queryParams.severity, queryParams.difficulty, queryParams.orderBy)
      } else if (queryParams.reportType === "search") {
        this.issues = null;
        this.reportType = queryParams.reportType;
      } else if (queryParams.reportType === "overview") {
        this.issues = null;
        this.reportType = queryParams.reportType;
        this.getIssuesOrdered(queryParams.tech, queryParams.status, queryParams.priority, queryParams.severity, queryParams.difficulty, queryParams.orderBy)
      }
    });
    this.newIssueForm = new FormGroup({
      'reportData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
      })
    });
  }

  ticketStats = {
    status: {
      open: 0,
      pending: 0,
      closed: 0
    },
    priority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    }
  };
  techs = [];
  generateOverviewReport() {

    //reset the vars
    //
    this.ticketStats.status.open = 0;
    this.ticketStats.priority.low = 0;
    this.ticketStats.priority.medium = 0;
    this.ticketStats.priority.high = 0;
    this.ticketStats.priority.urgent = 0;
    this.techs = []

    //map issue data
    //may lead to performance issues but theres no way to count firebase documents
    //could also write more efficient code here but i'm not getting paid for this 
    //
    this.issues$.map(e => {
      //add only unique technicans
      //
      if (!this.techs.some(el => el.tech === e.assignedTech)) {
        this.techs.push(
          {
            tech: e.assignedTech,
            open: 0,        
            low: 0,
            medium: 0,
            high: 0,
            urgent: 0,
          });
      }

      //get index of current tech on issue
      //
      const index = this.techs.findIndex(el => el.tech === e.assignedTech)
      let techObj = this.techs[index];
      if (e.assignedTech === techObj.tech && e.status === 'Open') {
        this.techs[index].open++;
        this.ticketStats.status.open++;
      } if (e.assignedTech === techObj.tech && e.status === 'Pending') {
        this.techs[index].pending++;
        this.ticketStats.status.pending++;
      }
      if (e.assignedTech === techObj.tech && e.status === 'Closed') {
        this.techs[index].closed++;
        this.ticketStats.status.closed++;
      }
      if (e.priority === 'Low') {
        this.techs[index].low++;
        this.ticketStats.priority.low++;
      } else if (e.priority === 'Medium') {
        this.techs[index].medium++;
        this.ticketStats.priority.medium++;
      } else if (e.priority === 'High') {
        this.techs[index].high++;
        this.ticketStats.priority.high++;
      } else {
        this.techs[index].urgent++;
        this.ticketStats.priority.urgent++;
      }
    });
  }

  getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy) {
    this.issuesService.getIssuesOrdered(tech, status, priority, severity, difficulty, orderBy)
      .then(issues => {
        if (issues.length > 0) {
          this.issues$ = issues.map(e => {
            return { id: e.id, ...e.data as {} } as Issue;
          });
        };
        this.errors = '';
        this.filterData();
      })
      .catch(err => {
        this.errors = 'ERROR: No documents were found';
      });
  }

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
            tech: e.assignedTech,
            priority: e.priority,
            severity: e.severity,
            status: e.status,
            difficulty: e.difficulty,
            dateStart: e.dateStart,
            dateEnd: e.dateEnd,
            //summary: e.desc.summary
          });
      }
    });
    this.generateOverviewReport();
  }

  onSubmit() {
    const tech = this.newIssueForm.value.reportData.tech;
    this.getIssuesOrdered(tech, "Open", null, null, null, null);
  }
}
