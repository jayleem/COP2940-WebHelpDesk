import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesAdminIssuesDetailComponent } from './issues-admin-issues-detail.component';

describe('IssuesAdminIssuesDetailComponent', () => {
  let component: IssuesAdminIssuesDetailComponent;
  let fixture: ComponentFixture<IssuesAdminIssuesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesAdminIssuesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesAdminIssuesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
