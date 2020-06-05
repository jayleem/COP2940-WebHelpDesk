import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesAdminIssuesListComponent } from './issues-admin-issues-list.component';

describe('IssuesAdminIssuesListComponent', () => {
  let component: IssuesAdminIssuesListComponent;
  let fixture: ComponentFixture<IssuesAdminIssuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesAdminIssuesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesAdminIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
