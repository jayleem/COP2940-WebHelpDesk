import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  emailRegex = '.+\@.+\..+' //No need for complex email regex
  pwdRegex = '^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\d]).*$'//password requirements
  ngOnInit() {
    this.registerForm = new FormGroup({
      'registrationData': new FormGroup({
        'fName': new FormControl(null, [Validators.required]),
        'lName': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.pattern(this.emailRegex)]),
        'password': new FormControl(null, [Validators.required, Validators.pattern(this.pwdRegex)])
      })
    });
  }

  onSubmit() {
    const fName = this.registerForm.get('registrationData.fName').value;
    const lName = this.registerForm.get('registrationData.lName').value;
    const email = this.registerForm.get('registrationData.email').value;
    const password = this.registerForm.get('registrationData.password').value;

    this.authService.signUp(email, password)
    .then(res => {
      const uid = res.user.uid;
      const username = res.user.email;
      const payload = {
        uid: res.user.uid,
        username: res.user.email,
        fName: this        
      }
      this.userService.addUser(fName, lName, uid, username);
    })
    .catch(err => {
      this.errorMessage = "Email address is already registered. If you have forgotten your password you may reset it by clicking below."
    })
  };

  resetPassword() {
    const email = this.registerForm.get('registrationData.email').value;
    this.authService.resetPassword(email)
    .then(res => {
      this.errorMessage = `An email containing further instructions to reset your password has been sent to ${email}.`
    })
    .catch(err => {
      this.errorMessage = "This email address is not registered."
    })  
  }
}
