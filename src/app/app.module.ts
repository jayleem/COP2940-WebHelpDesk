import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//Components
//
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
import { DashboardComponent } from './dashboard/dashboard.component';
import { DynamicTableComponent } from './shared/dynamic-table/dynamic-table.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardAnalyticsComponent } from './dashboard/dashboard-analytics/dashboard-analytics.component';
import { DashboardAdminAnalyticsComponent } from './dashboard/admin/dashboard-admin-analytics/dashboard-admin-analytics.component';
import { DashboardAdminIssuesListComponent } from './dashboard/admin/dashboard-admin-issues-list/dashboard-admin-issues-list.component';
import { DashboardAdminUsersListComponent } from './dashboard/admin/dashboard-admin-users-list/dashboard-admin-users-list.component';
import { DashboardAdminUsersDetailsComponent } from './dashboard/admin/dashboard-admin-users-details/dashboard-admin-users-details.component';
import { RoleAssignmentComponent } from './role-assignment/role-assignment.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { HelpComponent } from './help/help.component';
import { ProjectsComponent } from './projects/projects.component';

//Directives
//
import { BackButtonDirective } from './shared/back-button.directive';

//Services
//
import { IssuesService } from './shared/services/issues.service';
import { AuthService } from './shared/services/auth.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { LoginGuardService } from './shared/services/login-guard.service';
import { UserService } from './shared/services/user.service';
import { ProfileGuardService } from './shared/services/profile-guard.service';
import { RoleGuardService } from './shared/services/role-guard.service';
import { AdminRoleGuardService } from './shared/services/admin-role-guard.service';

//Angular Bootstrap
//
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Firebase
//
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth'

//Env config
//
import { environment } from 'src/environments/environment';


//ng-2 charts
//
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
    DashboardComponent,
    DynamicTableComponent,
    RegisterComponent,
    ProfileComponent,
    DashboardAnalyticsComponent,
    DashboardAdminAnalyticsComponent,
    DashboardAdminIssuesListComponent,
    DashboardAdminUsersListComponent,
    DashboardAdminUsersDetailsComponent,
    RoleAssignmentComponent,
    KnowledgeBaseComponent,
    HelpComponent,
    ProjectsComponent,
    BackButtonDirective
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
  providers: [IssuesService, AuthService, AuthGuardService, LoginGuardService, UserService, ProfileGuardService, RoleGuardService, AdminRoleGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
