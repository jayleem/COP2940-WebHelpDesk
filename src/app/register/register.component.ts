import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  credentialDataForm: FormGroup;
  errorMessage = "This email address is already registered. If you have forgotten your password you may reset it by clicking below.";

  constructor(private router: Router, private authService: AuthService) { }

  pwdRegex = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d]).*$'
  ngOnInit() {
    this.credentialDataForm = new FormGroup({
      'credentialData': new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.pwdRegex)])
      })
    });
  }

  onSubmit() {
    const email = this.credentialDataForm.get('credentialData.email').value;
    const password = this.credentialDataForm.get('credentialData.password').value;

    this.authService.signUp(email, password)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      this.errorMessage = "Email address is already registered. If you have forgotten your password you may reset it by clicking below."
    })
  };

  resetPassword() {
    const email = this.credentialDataForm.get('credentialData.email').value;
    this.authService.resetPassword(email)
    .then(res => {
      this.errorMessage = `An email containing further instructions to reset your password has been sent to ${email}.`
    })
    .catch(err => {
      this.errorMessage = "This email address is not registered."
    })  
  }
}
