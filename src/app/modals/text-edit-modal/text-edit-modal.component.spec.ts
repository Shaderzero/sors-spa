import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditModalComponent } from './text-edit-modal.component';

describe('TextEditModalComponent', () => {
  let component: TextEditModalComponent;
  let fixture: ComponentFixture<TextEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
