import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//Components
import { HeaderComponent} from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';
import { IssuesNewComponent } from './issues/issues-new/issues-new.component';
import { IssuesUpdateComponent } from './issues/issues-update/issues-update.component';
import { IssuesComponent } from './issues/issues.component';
import { IssuesListComponent } from './issues/issues-list/issues-list.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';
import { ReportsComponent } from './reports/reports.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';
import { LoginComponent } from './login/login.component';
import { IssuesDashboardComponent } from './issues/issues-dashboard/issues-dashboard.component';
import { DynamicTableComponent } from './shared/dynamic-table/dynamic-table.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

//Services
import { IssuesService } from './shared/services/issues.service';
import { AuthService } from './shared/services/auth.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { LoginGuardService } from './shared/services/login-guard.service';
import { UserService } from './shared/services/user.service';
import { ProfileGuardService } from './shared/services/profile-guard.service';

//Angular Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth'

//Env config
import { environment } from 'src/environments/environment';


//ng-2 charts
import { ChartsModule } from 'ng2-charts';

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
    LoginComponent,
    IssuesDashboardComponent,
    DynamicTableComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [IssuesService, AuthService, AuthGuardService, LoginGuardService, UserService, ProfileGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
