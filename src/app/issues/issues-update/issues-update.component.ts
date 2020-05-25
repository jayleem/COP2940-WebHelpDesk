import { Component, OnInit } from '@angular/core';
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
  //firestore subscription
  //
  firestoreSubscription: Subscription;
  updateIssueForm: FormGroup;
  id: string;
  issue$;

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

  getIssueById(id) {
    this.firestoreSubscription = this.issueService.getIssuesById(id).subscribe(data => {
      this.issue$ = data;
      this.updateIssueForm.get('issueData.tech').setValue(`${data.tech}`);
      this.updateIssueForm.get('issueData.priority').setValue(`${data.priority}`);
      this.updateIssueForm.get('issueData.status').setValue(`${data.status}`);
    });
  }

  onSubmit() {
    this.issueService.updateIssue(this.id, this.updateIssueForm);
    this.router.navigate(['/issues/list']);
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    this.firestoreSubscription.unsubscribe();
  }
}
