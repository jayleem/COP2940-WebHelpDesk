import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssuesListComponent } from './issues/issues-list/issues-list.component';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';
import { IssuesUpdateComponent } from './issues/issues-update/issues-update.component';
import { IssuesNewComponent } from './issues/issues-new/issues-new.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { LoginGuardService } from './shared/services/login-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuardService } from './shared/services/profile-guard.service';
import { DashboardAnalyticsComponent } from './dashboard/dashboard-analytics/dashboard-analytics.component';
import { DashboardAdminAnalyticsComponent } from './dashboard/admin/dashboard-admin-analytics/dashboard-admin-analytics.component';
import { DashboardAdminIssuesListComponent } from './dashboard/admin/dashboard-admin-issues-list/dashboard-admin-issues-list.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardAdminUsersListComponent } from './dashboard/admin/dashboard-admin-users-list/dashboard-admin-users-list.component';
import { DashboardAdminUsersDetailsComponent } from './dashboard/admin/dashboard-admin-users-details/dashboard-admin-users-details.component';
import { RoleGuardService } from './shared/services/role-guard.service';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuardService] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], children: [
      { path: 'home', component: DashboardAnalyticsComponent },
      { path: 'issues/list/:user', component: IssuesListComponent },
      { path: 'issues/new', component: IssuesNewComponent },
      { path: 'issues/details/:id', component: IssuesDetailComponent },
      { path: 'issues/update/:id', component: IssuesUpdateComponent },
      //ADMIN ROUTES
      { path: 'admin/home', component: DashboardAdminAnalyticsComponent, canActivate: [RoleGuardService] },
      { path: 'admin/issues', component: DashboardAdminIssuesListComponent, canActivate: [RoleGuardService] },
      { path: 'admin/users', component: DashboardAdminUsersListComponent, canActivate: [RoleGuardService] },
      { path: 'admin/users/details/:id', component: DashboardAdminUsersDetailsComponent, canActivate: [RoleGuardService] },
      {
        path: 'admin/reports', component: ReportsComponent, children: [
          { path: 'user/:id', component: ReportsListComponent }
        ]
      },
    ]
  },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuardService, ProfileGuardService] },
  { path: '404', component: RouteNotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
