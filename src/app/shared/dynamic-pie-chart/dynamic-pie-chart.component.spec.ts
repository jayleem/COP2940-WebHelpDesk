import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPieChartComponent } from './dynamic-pie-chart.component';

describe('DynamicPieChartComponent', () => {
  let component: DynamicPieChartComponent;
  let fixture: ComponentFixture<DynamicPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
