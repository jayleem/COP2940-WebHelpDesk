import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
//Components
import { HeaderComponent} from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { IssuesListComponent } from './issues/issues-list/issues-list.component';
import { ReportsComponent } from './reports/reports.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';
import { HomeComponent } from './home/home.component';
import { IssuesDashboardComponent } from './issues/issues-dashboard/issues-dashboard.component';

//Angular Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

//Env config
import { environment } from 'src/environments/environment';
import { IssuesService } from './shared/issues.service';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';
import { IssuesNewComponent } from './issues/issues-new/issues-new.component';
import { IssuesUpdateComponent } from './issues/issues-update/issues-update.component';
import { IssuesComponent } from './issues/issues.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';

//ng-2 charts
import { ChartsModule } from 'ng2-charts';
import { DynamicTableComponent } from './shared/dynamic-table/dynamic-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IssuesListComponent,
    ReportsComponent,
    IssuesComponent,
    IssuesDetailComponent,
    IssuesNewComponent,
    IssuesUpdateComponent,
    ReportsListComponent,
    RouteNotFoundComponent,
    HomeComponent,
    IssuesDashboardComponent,
    DynamicTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [IssuesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
