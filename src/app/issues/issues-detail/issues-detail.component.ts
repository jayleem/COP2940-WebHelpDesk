import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-issues-detail',
  templateUrl: './issues-detail.component.html',
  styleUrls: ['./issues-detail.component.scss']
})
export class IssuesDetailComponent implements OnInit {
  issues$;
  errors;
  id;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute, private location: Location) { }

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
      this.issues$ = res;
    })
    .catch(err => {
      this.issues$ = undefined;
      this.errors = err;
    })
  }
}
