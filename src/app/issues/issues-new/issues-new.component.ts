import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-issues-new',
  templateUrl: './issues-new.component.html',
  styleUrls: ['./issues-new.component.scss']
})

export class IssuesNewComponent implements OnInit {
  public firestoreSubscriptions: Subscription[] = [];
  public techs$: any;
  newIssueForm: FormGroup;

  private user;
  constructor(private issueService: IssuesService, private userService: UserService, private fireAuthService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = this.fireAuthService.getUser();
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

  onSubmit() {
    //add issue
    //
    console.log(this.user)
    this.issueService.addIssue(this.user.email, this.newIssueForm)
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
      console.log(err);
    });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
