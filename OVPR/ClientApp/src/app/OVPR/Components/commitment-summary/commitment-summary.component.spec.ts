import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentSummaryComponent } from './commitment-summary.component';

describe('CommitmentSummaryComponent', () => {
  let component: CommitmentSummaryComponent;
  let fixture: ComponentFixture<CommitmentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitmentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
