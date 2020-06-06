import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminUsersDetailsComponent } from './dashboard-admin-users-details.component';

describe('DashboardAdminUsersDetailsComponent', () => {
  let component: DashboardAdminUsersDetailsComponent;
  let fixture: ComponentFixture<DashboardAdminUsersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdminUsersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdminUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
