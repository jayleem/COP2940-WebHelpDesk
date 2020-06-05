import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})

export class ReportsListComponent implements OnInit {

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
  }  
  }
