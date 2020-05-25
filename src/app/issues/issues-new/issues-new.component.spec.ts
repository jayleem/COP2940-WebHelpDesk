import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesNewComponent } from './issues-new.component';

describe('IssuesNewComponent', () => {
  let component: IssuesNewComponent;
  let fixture: ComponentFixture<IssuesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
