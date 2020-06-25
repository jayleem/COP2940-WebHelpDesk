import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Location } from '@angular/common';
import { Issue } from 'src/app/models/issue.model';

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
  success;
  modifiedDate: Date;

  constructor(
    private issuesService: IssuesService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
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
          if (user.payload.doc.data().accountStatus && user.payload.doc.data().role != 'admin') {
            users.push({ id: user.payload.doc.id, ...user.payload.doc.data() as {} } as User);
          }
        });
        //filter + sort data
        //
        users = users.sort((a, b) => (a.role.toUpperCase() < b.role.toUpperCase()) ? -1 : (a.role.toUpperCase() > b.role.toUpperCase()) ? 1 : 0);
        if (this.user.role != 'admin') {
          users = users.filter((user: any) => user.id == this.user.uid);
        }
      } else {
        this.errors.push('ERROR: No documents were found');
        users = [];
      }
      return this.users$ = users;
    }));
  }

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
      setTimeout(() => { this.errors, this.success = '' }, 1000);
      this.issues$ = dataArr.filter(issues => issues.id == id);
      //update the updateIssueForm FormGroup with data from the retrieved data
      //
      this.updateIssueForm.get('issueData.tech').setValue(`${this.issues$[0].assignedTech}`);
      this.updateIssueForm.get('issueData.priority').setValue(`${this.issues$[0].priority}`);
      this.updateIssueForm.get('issueData.severity').setValue(`${this.issues$[0].severity}`);
      this.updateIssueForm.get('issueData.difficulty').setValue(`${this.issues$[0].difficulty}`);
      this.updateIssueForm.get('issueData.status').setValue(`${this.issues$[0].status}`);
      getOnce.unsubscribe();//should work
    });
  }

  onSubmit() {
    const user = this.updateIssueForm.get('issueData.tech').value;
    this.issuesService.updateIssue(this.id, user, this.updateIssueForm, this.modifiedDate)
      .then(res => {
        this.success = res;
        console.log(res);
        //Update user history
        //
        this.userService.updateUserHistory(this.user.uid, "Updated", this.id);
        //Reload the issue
        //
        this.getIssueById(this.id);
      })
      .catch(err => {
        this.errors = err;
      })
  }
}
