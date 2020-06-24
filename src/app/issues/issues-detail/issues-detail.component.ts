import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Issue } from 'src/app/models/issue.model';

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
  getIssueById(id) {
    let dataArr = [];
    const getOnce = this.issuesService.getAggregation().subscribe(data => {
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
      this.issues$ = dataArr.filter(issues => issues.id == id);
      console.log(this.issues$[0].id);
      getOnce.unsubscribe();
    });
  }
}