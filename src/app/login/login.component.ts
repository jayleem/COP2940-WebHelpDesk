import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  errorMessage;
  credentialDataForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.credentialDataForm = new FormGroup({
      'credentialData': new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required])
      })
    });
  }

  onSubmit() {
    //reset error message
    //
    this.errorMessage = "";
    //get provided credentials
    //
    const email = this.credentialDataForm.get('credentialData.email').value;
    const password = this.credentialDataForm.get('credentialData.password').value;
    //login user with provided credentials
    //
    let disabled;
    this.authService.signIn(email, password)
      .then((res) => {
        disabled = this.authService.getLoggedIn();
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        this.errorMessage = "Invalid username or password."
      });
    //if account is disabled show error message
    //
    if(disabled && !this.errorMessage) {
      console.log(this.authService.getLoggedIn());
      this.errorMessage = "Your account has been disabled. Please contact an adminstrator if you need assistance.";
    }
  }
}
