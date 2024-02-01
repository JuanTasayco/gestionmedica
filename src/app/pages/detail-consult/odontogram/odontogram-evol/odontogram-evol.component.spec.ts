import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdontogramEvolComponent } from './odontogram-evol.component';

describe('OdontogramEvolComponent', () => {
  let component: OdontogramEvolComponent;
  let fixture: ComponentFixture<OdontogramEvolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdontogramEvolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdontogramEvolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
