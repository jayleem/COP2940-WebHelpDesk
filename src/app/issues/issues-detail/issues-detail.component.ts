import { Component, OnInit } from '@angular/core';
import { IssuesService } from 'src/app/shared/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issues-detail',
  templateUrl: './issues-detail.component.html',
  styleUrls: ['./issues-detail.component.scss']
})
export class IssuesDetailComponent implements OnInit {

  issue$;
  id;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getIssueById(this.id);
  }

  //Calls the getIssueById method in issuesService for a matching document by id from the firebase database collection
  //
  getIssueById(id) {
    this.issuesService.getIssuesById(id).subscribe(data => {
      this.issue$ = data;
    });
  }  
}
