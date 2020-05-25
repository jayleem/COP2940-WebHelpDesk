import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesDetailComponent } from './issues-detail.component';

describe('IssuesDetailComponent', () => {
  let component: IssuesDetailComponent;
  let fixture: ComponentFixture<IssuesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
