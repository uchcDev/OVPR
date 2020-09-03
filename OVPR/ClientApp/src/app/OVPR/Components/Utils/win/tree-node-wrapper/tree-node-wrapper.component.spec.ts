import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodeWrapperComponent } from './tree-node-wrapper.component';

describe('TreeNodeWrapperComponent', () => {
  let component: TreeNodeWrapperComponent;
  let fixture: ComponentFixture<TreeNodeWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeNodeWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
