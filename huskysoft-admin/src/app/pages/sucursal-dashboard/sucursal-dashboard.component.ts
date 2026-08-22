// src/app/pages/sucursal-dashboard/sucursal-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sucursal-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sucursal-dashboard.component.html',
  styleUrl: './sucursal-dashboard.component.scss'
})
export class SucursalDashboardComponent implements OnInit {
  veterinariaId!: number;
  sucursalId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.veterinariaId = Number(this.route.snapshot.paramMap.get('veterinariaId'));
    this.sucursalId = Number(this.route.snapshot.paramMap.get('sucursalId'));
  }
}
