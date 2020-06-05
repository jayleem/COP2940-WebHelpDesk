import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesAdminUsersDetailComponent } from './issues-admin-users-detail.component';

describe('IssuesAdminUsersDetailComponent', () => {
  let component: IssuesAdminUsersDetailComponent;
  let fixture: ComponentFixture<IssuesAdminUsersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesAdminUsersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesAdminUsersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
