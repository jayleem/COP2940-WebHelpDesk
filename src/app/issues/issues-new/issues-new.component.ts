import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-issues-new',
  templateUrl: './issues-new.component.html',
  styleUrls: ['./issues-new.component.scss']
})

export class IssuesNewComponent implements OnInit {
  public firestoreSubscriptions: Subscription[] = [];
  public users$: any;
  newIssueForm: FormGroup;

  private user;
  constructor(
    private issueService: IssuesService, 
    private userService: UserService, 
    private authService: AuthService, 
    private router: Router,
    private location: Location
    ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.newIssueForm = new FormGroup({
      'issueData': new FormGroup({
        'title': new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
        'tech': new FormControl(null, [Validators.required]),
        'priority': new FormControl('Low', [Validators.required]),
        'severity': new FormControl('Minor', [Validators.required]),
        'difficulty': new FormControl('Easy', [Validators.required]),
        'summary': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'reproduce': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'expctRes': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
        'actlRes': new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(255)]),
      })
    });
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
        users = [];
      }
      return this.users$ = users;
    }));
  }

  onSubmit() {
    //add issue
    //
    const user = this.newIssueForm.get('issueData.tech').value;
    this.issueService.addIssue(user, this.newIssueForm)
      //update user history
      //
      .then(res => {
        const id = res;
        this.userService.updateUserHistory(this.user.uid, "Created", id);
        //navigate back to issue list
        //
        this.router.navigate(['/dashboard/home']);
      })
      .catch(err => {
        //adding issue failed
      });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
