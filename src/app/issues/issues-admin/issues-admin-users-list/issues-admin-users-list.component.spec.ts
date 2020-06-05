import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesAdminUsersListComponent } from './issues-admin-users-list.component';

describe('IssuesAdminUsersListComponent', () => {
  let component: IssuesAdminUsersListComponent;
  let fixture: ComponentFixture<IssuesAdminUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesAdminUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesAdminUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
