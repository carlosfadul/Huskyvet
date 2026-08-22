import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaFormComponent } from './veterinaria-form.component';

describe('VeterinariaFormComponent', () => {
  let component: VeterinariaFormComponent;
  let fixture: ComponentFixture<VeterinariaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
