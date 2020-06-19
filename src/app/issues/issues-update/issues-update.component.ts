import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-issues-update',
  templateUrl: './issues-update.component.html',
  styleUrls: ['./issues-update.component.scss']
})

export class IssuesUpdateComponent implements OnInit {
  firestoreSubscriptions: Subscription[] = [];
  users$: any;
  updateIssueForm: FormGroup;
  id: string;
  user: any;
  issues$;
  errors;
  modifiedDate: Date;

  constructor(
    private issueService: IssuesService, 
    private userService: UserService, 
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private location: Location) { }
  //Get the current route snapshot id paramater
  //
  ngOnInit() {
    this.user = this.authService.getUser();
    this.updateIssueForm = new FormGroup({

      'issueData': new FormGroup({
        'tech': new FormControl(null, [Validators.required]),
        'priority': new FormControl(null, [Validators.required]),
        'severity': new FormControl(null, [Validators.required]),
        'difficulty': new FormControl(null, [Validators.required]),
        'escalate': new FormControl(0, [Validators.required]),
        'status': new FormControl(null, [Validators.required]),
        'notes': new FormControl(null, [Validators.maxLength(255)])
      }),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.modifiedDate = new Date();
    this.getIssueById(this.id);
    this.users$ = this.getUsers()
  }

  //get users only enabled accounts and non admin roles
  //refactored as the template was accessing the array before finishing the logic and async/await didn't solve the issue
  //
   getUsers() {
    let users = [];
    this.firestoreSubscriptions.push(this.userService.getUsers().subscribe(data => {
      if (data.length > 0) {
        data.map(user => {
			 if (user.payload.doc.data().accountStatus == true && user.payload.doc.data().role != 'admin') {
          users.push({ id: user.payload.doc.id, ...user.payload.doc.data() as {} } as User);
			 }
        });
      } else {
        this.errors.push('ERROR: No documents were found');
        users = [];
      }
    }));
    return this.users$ = users;
  }

  getIssueById(id) {
    this.issueService.getIssuesById(id)
      .then(res => {
        this.issues$ = res;
        this.updateIssueForm.get('issueData.tech').setValue(`${this.issues$[0].data.assignedTech}`);
        this.updateIssueForm.get('issueData.priority').setValue(`${this.issues$[0].data.priority}`);
        this.updateIssueForm.get('issueData.severity').setValue(`${this.issues$[0].data.severity}`);
        this.updateIssueForm.get('issueData.difficulty').setValue(`${this.issues$[0].data.difficulty}`);
        this.updateIssueForm.get('issueData.status').setValue(`${this.issues$[0].data.status}`);
      })
      .catch(err => {
        this.issues$ = undefined;
        this.errors = err;
      });
  }

  onSubmit() {
    this.issueService.updateIssue(this.id, this.user.email, this.updateIssueForm, this.modifiedDate)
      .then(res => {
        console.log(res);
        //Update user history
        //
        this.userService.updateUserHistory(this.user.uid, "Updated", this.id);
        //Navigate back to issues
        //
        this.router.navigate(['dashboard/home']);
      })
      .catch(err => {
        this.errors = err;
      })
  }
}
