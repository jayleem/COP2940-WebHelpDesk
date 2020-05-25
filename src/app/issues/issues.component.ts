import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {
  toggleView = false;

  constructor() { }

  ngOnInit() {}

  toggleBtn() {
    this.toggleView ? this.toggleView = false:this.toggleView = true;
    console.log(this.toggleView);
  }
}
