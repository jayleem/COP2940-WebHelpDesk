import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesUpdateComponent } from './issues-update.component';

describe('IssuesUpdateComponent', () => {
  let component: IssuesUpdateComponent;
  let fixture: ComponentFixture<IssuesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
