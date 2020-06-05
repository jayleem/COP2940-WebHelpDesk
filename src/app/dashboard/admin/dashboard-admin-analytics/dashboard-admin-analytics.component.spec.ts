import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminAnalyticsComponent } from './dashboard-admin-analytics.component';

describe('DashboardAdminAnalyticsComponent', () => {
  let component: DashboardAdminAnalyticsComponent;
  let fixture: ComponentFixture<DashboardAdminAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardAdminAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdminAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
