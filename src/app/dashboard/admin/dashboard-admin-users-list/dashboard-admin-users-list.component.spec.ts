import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminUsersListComponent } from './dashboard-admin-users-list.component';

describe('DashboardAdminUsersListComponent', () => {
  let component: DashboardAdminUsersListComponent;
  let fixture: ComponentFixture<DashboardAdminUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdminUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdminUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
