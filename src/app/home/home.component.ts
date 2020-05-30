import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  credentialDataForm: FormGroup;

  constructor(private router: Router) { }

  ngOnInit() {
    this.credentialDataForm = new FormGroup({
      'credentialData': new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required])
      })
    });
  }

  onSubmit() {
    console.log(this.credentialDataForm)
    this.router.navigate(['/issues/dashboard']);
  }
}
