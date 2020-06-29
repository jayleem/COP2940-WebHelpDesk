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
    let role;
    this.authService.signIn(email, password)
      .then(() => {
        //user signed in
      })
      .catch(err => {
        //user sign in failed
        this.errorMessage = "There was an error with your E-Mail/Password combination. Please try again."
      });
    }

  resetPassword() {
    const email = this.credentialDataForm.get('credentialData.email').value;
    this.authService.resetPassword(email)
      .then(res => {
        this.errorMessage = "Further instructions with how to reset your password were sent to the provided email address.";
      })
      .catch(err => {
        //account doesn't exist
        //
        this.errorMessage = "No accounts were found associated with the provided email address.";
      })
  }
}
