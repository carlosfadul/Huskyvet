import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariasComponent } from './veterinarias.component';

describe('VeterinariasComponent', () => {
  let component: VeterinariasComponent;
  let fixture: ComponentFixture<VeterinariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
