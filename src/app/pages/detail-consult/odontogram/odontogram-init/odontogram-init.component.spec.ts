import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontogramInitComponent } from './odontogram-init.component';

describe('OdontogramInitComponent', () => {
  let component: OdontogramInitComponent;
  let fixture: ComponentFixture<OdontogramInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdontogramInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdontogramInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
