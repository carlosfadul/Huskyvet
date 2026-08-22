import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaAdminComponent } from './veterinaria-admin.component';

describe('VeterinariaAdminComponent', () => {
  let component: VeterinariaAdminComponent;
  let fixture: ComponentFixture<VeterinariaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
