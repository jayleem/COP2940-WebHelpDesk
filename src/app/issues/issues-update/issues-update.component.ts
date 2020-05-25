import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/issues.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-issues-update',
  templateUrl: './issues-update.component.html',
  styleUrls: ['./issues-update.component.scss']
})

export class IssuesUpdateComponent implements OnInit {
  updateIssueForm: FormGroup;
  issue$;
  id;

  constructor(private issueService: IssuesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getIssueById(this.id);
    this.updateIssueForm = new FormGroup({

      'issueData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
        'status': new FormControl(null, [Validators.required]),
        'notes': new FormControl(null),
      }),
      'status': new FormControl('Open')
    });
  }

  getIssueById(id) {
    this.issueService.getIssuesById(id).subscribe(data => {
      this.issue$ = data;
    });
  }  

  onSubmit() {
    this.issueService.updateIssue(this.id, this.updateIssueForm);
    this.router.navigate(['/issues/list']);
  }
}
