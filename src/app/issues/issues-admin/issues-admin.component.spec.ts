import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesAdminComponent } from './issues-admin.component';

describe('IssuesAdminComponent', () => {
  let component: IssuesAdminComponent;
  let fixture: ComponentFixture<IssuesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
