import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard-admin-users-details',
  templateUrl: './dashboard-admin-users-details.component.html',
  styleUrls: ['./dashboard-admin-users-details.component.scss']
})
export class DashboardAdminUsersDetailsComponent implements OnInit {
  updateUserForm: FormGroup;

  user$: any;
  errors: string;
  id: string;

  constructor(private userService: UserService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  //Get the current route snapshot id paramater
  //
  ngOnInit() {
    this.updateUserForm = new FormGroup({
      'userData': new FormGroup({
        'role': new FormControl(null, [Validators.required]),
        'status': new FormControl(null, [Validators.required])
      }),
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUserById(this.id);
  }

  //Calls the getUserById method inuserService for a matching document by id from the firebase database collection
  //
  getUserById(id) {
    this.userService.getUserById(id)
      .then(res => {
        this.user$ = res;
        this.updateUserForm.get('userData.role').setValue(`${this.user$[0].data.role}`);
        this.updateUserForm.get('userData.status').setValue(`${this.user$[0].data.accountStatus}`);
      })
      .catch(err => {
        this.user$ = null;
      })
  }

  //Send user an email to reset their password
  //
  resetUserPassword() {
    const email = this.user$.email;
    this.authService.resetPassword(email);
  }

  //Update the users role and account status
  //
  onSubmit() {
      this.userService.updateUser(this.id, this.updateUserForm)
        .then(res => {
          console.log(res);
          this.router.navigate(['/dashboard/admin/users']);
        })
        .catch(err => {
          this.errors = err;
        })
    }

}

