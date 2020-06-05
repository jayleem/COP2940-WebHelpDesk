import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminIssuesListComponent } from './dashboard-admin-issues-list.component';

describe('DashboardAdminIssuesListComponent', () => {
  let component: DashboardAdminIssuesListComponent;
  let fixture: ComponentFixture<DashboardAdminIssuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdminIssuesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdminIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
