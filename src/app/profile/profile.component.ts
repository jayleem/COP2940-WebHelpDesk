import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  updateCredentialsForm: FormGroup;

  user$: any;
  errors: string;
  id: string;
  metadata: any;

  constructor(private userService: UserService, private authService: AuthService, private route: ActivatedRoute) { }
  pwdRegex = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\d]).*$'//password requirements

  //Get the current route snapshot id paramater
  //
  ngOnInit() {
    this.updateCredentialsForm = new FormGroup({
      'updateCredentialData': new FormGroup({
        'oldPassword': new FormControl(null, [Validators.required]),
        'newPassword': new FormControl(null, [Validators.required, Validators.pattern(this.pwdRegex)]),
        'confirmPassword': new FormControl(null, [Validators.required, Validators.pattern(this.pwdRegex), this.confirmPassword.bind(this)])
      })
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.getUserById(this.id);
    this.getMetadata();
  }

  //Calls the getIssueById method in issuesService for a matching document by id from the firebase database collection
  //
  getUserById(id) {
    this.userService.getUserById(id)
      .then(res => {
        this.user$ = res;
      })
      .catch(err => {
        this.user$ = null;
      })
  }

  getMetadata() {
    this.authService.getMetadata()
      .then(user => {
        const creationTime = user.metadata.creationTime;
        const lastSignInTime = user.metadata.lastSignInTime;
        const metadata = {
          creationTime: creationTime,
          lastSignInTime: lastSignInTime
        }
        this.metadata = metadata;
      })
      .catch(err => {
        this.metadata = null;
        //failed prob no user logged in
      });
  }

  //Custom validation method
  confirmPassword(control: FormControl): { [s: string] :boolean } {
    //if passwords dont match fail validation
    if(this.updateCredentialsForm) {
      const newPassword = this.updateCredentialsForm.get('updateCredentialData.newPassword').value;
      const confirmPassword = this.updateCredentialsForm.get('updateCredentialData.confirmPassword').value;
      return this.updateCredentialsForm.get('updateCredentialData.newPassword').value != this.updateCredentialsForm.get('updateCredentialData.confirmPassword').value ? { 'passwordMismatch': true }: null;
    } else {
      return null;
    }
  }

  onSubmit() {
    const oldPassword = this.updateCredentialsForm.get('updateCredentialData.oldPassword').value;
    const newPassword = this.updateCredentialsForm.get('updateCredentialData.newPassword').value;

    this.authService.reauthenticateUser(oldPassword)
      .then(res => {
        //update password here
        this.authService.updatePassword(newPassword);
        this.authService.signOut()
      })
      .catch(err => {
        //do something on failure
      });
  }
}

