import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateEditModalComponent } from './date-edit-modal.component';

describe('DateEditModalComponent', () => {
  let component: DateEditModalComponent;
  let fixture: ComponentFixture<DateEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
