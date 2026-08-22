import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalDashboardComponent } from './sucursal-dashboard.component';

describe('SucursalDashboardComponent', () => {
  let component: SucursalDashboardComponent;
  let fixture: ComponentFixture<SucursalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
