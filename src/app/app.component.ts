import { Component } from '@angular/core';
import { LocationService } from './shared/services/location.service';
import { Router, NavigationStart, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebHelpDesk';

  ngOnDestroy() {

  }
}
