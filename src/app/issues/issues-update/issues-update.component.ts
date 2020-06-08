import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-issues-update',
  templateUrl: './issues-update.component.html',
  styleUrls: ['./issues-update.component.scss']
})

export class IssuesUpdateComponent implements OnInit {
  firestoreSubscriptions: Subscription[] = [];
  techs$: any;
  updateIssueForm: FormGroup;
  id: string;
  user: any;
  issues$;
  errors;
  modifiedDate: Date;

  constructor(private issueService: IssuesService, private userService: UserService, private fireAuthService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.user = this.fireAuthService.getUser();
    this.updateIssueForm = new FormGroup({

      'issueData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
        'priority': new FormControl(null, [Validators.required]),
        'status': new FormControl(null, [Validators.required]),
        'notes': new FormControl(null, [Validators.maxLength(255)])
      }),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.modifiedDate = new Date();
    this.getIssueById(this.id);
    this.techs$ = this.getUsers()
  }

  //get users
  //
  getUsers() {
    this.firestoreSubscriptions.push(this.userService.getUsers().subscribe(data => {
      if (data.length > 0) {
        this.techs$ = data.map(e => {
          return { ...e.payload.doc.data() as {} } as User;
        });
      } else {
        console.log('ERROR: No documents were found');
        this.techs$ = undefined;
      }
    }));
  }

  getIssueById(id) {
    this.issueService.getIssuesById(id)
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
    this.issueService.updateIssue(this.id, this.updateIssueForm, this.modifiedDate)
      .then(res => {
        console.log(res);
        //Update user history
        //
        this.userService.updateUserHistory(this.user.uid, "Updated", this.id);
        //Navigate back to issues
        //
        this.router.navigate(['dashboard/issues']);
      })
      .catch(err => {
        this.errors = err;
      })
  }
}
