/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DraftEditComponent } from './draft-edit.component';

describe('DraftEditComponent', () => {
  let component: DraftEditComponent;
  let fixture: ComponentFixture<DraftEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
