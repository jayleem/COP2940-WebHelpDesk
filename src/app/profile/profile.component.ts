import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: any;
  errors: string;
  id: string;
  metadata: any;

  constructor(private userService: UserService, private authService: AuthService, private route: ActivatedRoute) { }

  //Get the current route snapshot id paramater
  //
  ngOnInit() {
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
        console.log(err);
      });
  }

  onSubmit() {
    let password = "P4$$w0rd"
    this.authService.reauthenticateUser(password)
    .then(res => {
      //update password here
      console.log(res)
    })
    .catch(err => {
      //do something here like sign out or just display an error
      console.log(err)
    });
  }
}

