import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssuesListComponent } from './issues/issues-list/issues-list.component';
import { ReportsComponent } from './reports/reports.component';
import { IssuesComponent } from './issues/issues.component';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';
import { IssuesUpdateComponent } from './issues/issues-update/issues-update.component';
import { IssuesNewComponent } from './issues/issues-new/issues-new.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  {
    path: 'issues', component: IssuesComponent, children: [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
