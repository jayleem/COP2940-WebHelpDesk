import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-issues-update',
  templateUrl: './issues-update.component.html',
  styleUrls: ['./issues-update.component.scss']
})

export class IssuesUpdateComponent implements OnInit {
  updateIssueForm: FormGroup;
  id: string;
  issues$;
  errors;

  constructor(private issueService: IssuesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.updateIssueForm = new FormGroup({
      
      'issueData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
        'priority': new FormControl(null, [Validators.required]),
        'status': new FormControl(null, [Validators.required]),
        'notes': new FormControl(null),
      }),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.getIssueById(this.id);
  }

  async getIssueById(id) {
    await this.issueService.getIssuesById(id)
    .then(res => {
      this.issues$ = res;
      this.updateIssueForm.get('issueData.tech').setValue(`${this.issues$[0].data.tech}`);
      this.updateIssueForm.get('issueData.priority').setValue(`${this.issues$[0].data.priority}`);
      this.updateIssueForm.get('issueData.status').setValue(`${this.issues$[0].data.status}`);
    })
    .catch(err => {
      this.issues$ = undefined;
      this.errors = err;
    });
  }

  onSubmit() {
    this.issueService.updateIssue(this.id, this.updateIssueForm);
    this.router.navigate(['/issues/list']);
  }
}
