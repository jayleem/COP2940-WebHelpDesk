import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IssuesService } from '../shared/issues.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsListComponent } from './reports-list/reports-list.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

  newIssueForm: FormGroup;

  constructor(private issueService: IssuesService, private router: Router) { }

  ngOnInit() {
    this.newIssueForm = new FormGroup({
      'reportData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
      })
    });
  }

  onSubmit() {
    const tech = this.newIssueForm.value.reportData.tech;
    this.router.navigate([`/reports/list/${tech}`]);
  }

}
