import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentResponsibleModalComponent } from './incident-responsible-modal.component';

describe('IncidentResponsibleModalComponent', () => {
  let component: IncidentResponsibleModalComponent;
  let fixture: ComponentFixture<IncidentResponsibleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentResponsibleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentResponsibleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
