import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssuesListComponent } from './issues/issues-list/issues-list.component';
import { ReportsComponent } from './reports/reports.component';
import { IssuesComponent } from './issues/issues.component';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';
import { IssuesUpdateComponent } from './issues/issues-update/issues-update.component';
import { IssuesNewComponent } from './issues/issues-new/issues-new.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';
import { LoginComponent } from './login/login.component';
import { IssuesDashboardComponent } from './issues/issues-dashboard/issues-dashboard.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  {
    path: 'issues', component: IssuesComponent, canActivate: [AuthGuardService], children: [
      { path: 'dashboard', component: IssuesDashboardComponent},
      { path: 'list', component: IssuesListComponent },
      { path: 'new', component: IssuesNewComponent },
      { path: 'details/:id', component: IssuesDetailComponent },
      { path: 'update/:id', component: IssuesUpdateComponent },
    ]
  },
  {
    path: 'reports', component: ReportsComponent, children: [
      { path: 'list/:tech', component: ReportsListComponent }
    ]
  },
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
