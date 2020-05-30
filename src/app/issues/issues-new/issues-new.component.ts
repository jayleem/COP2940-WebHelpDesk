import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/issues.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues-new',
  templateUrl: './issues-new.component.html',
  styleUrls: ['./issues-new.component.scss']
})

export class IssuesNewComponent implements OnInit {
  newIssueForm: FormGroup;

  constructor(private issueService:IssuesService, private router: Router) { }

  ngOnInit() {
    this.newIssueForm = new FormGroup({
      'issueData': new FormGroup({
        'title': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
        'tech': new FormControl(null, [Validators.required, Validators.email]),
        'priority': new FormControl('Low', [Validators.required]),
        'summary': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'reproduce': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'expctRes': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'actlRes': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
      })
    });
  }

  onSubmit() {
    this.issueService.addIssue(this.newIssueForm)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
    this.router.navigate(['/issues/list']);
  }
}
