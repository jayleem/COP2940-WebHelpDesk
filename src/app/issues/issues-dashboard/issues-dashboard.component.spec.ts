import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesDashboardComponent } from './issues-dashboard.component';

describe('IssuesDashboardComponent', () => {
  let component: IssuesDashboardComponent;
  let fixture: ComponentFixture<IssuesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
