import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontogramModalComponent } from './odontogram-modal.component';

describe('OdontogramModalComponent', () => {
  let component: OdontogramModalComponent;
  let fixture: ComponentFixture<OdontogramModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdontogramModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdontogramModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
