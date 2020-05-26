import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/shared/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issues-detail',
  templateUrl: './issues-detail.component.html',
  styleUrls: ['./issues-detail.component.scss']
})
export class IssuesDetailComponent implements OnInit {
  issues$;
  errors;
  id;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute) { }

  //Get the current route snapshot id paramater
  //
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getIssueById(this.id);
  }

  //Calls the getIssueById method in issuesService for a matching document by id from the firebase database collection
  //
  async getIssueById(id) {
    await this.issuesService.getIssuesById(id)
    .then(res => {
      console.log(res);
      this.issues$ = res;
      //this.updateIssueForm.get('issueData.tech').setValue(`${res.tech}`);
      //this.updateIssueForm.get('issueData.priority').setValue(`${res.priority}`);
      //this.updateIssueForm.get('issueData.status').setValue(`${res.status}`);
    })
    .catch(err => {
      this.issues$ = undefined;
      this.errors = err;
    })
  }
}
