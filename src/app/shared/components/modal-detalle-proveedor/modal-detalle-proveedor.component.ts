import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ReferenciaService } from '@shared/services/referencia.service';

@Component({
  selector: 'modal-detalle-proveedor',
  templateUrl: './modal-detalle-proveedor.component.html',
  styleUrls: ['./modal-detalle-proveedor.component.scss']
})

export class ModalDetalleProveedorComponent implements OnInit {
  showPaciente: boolean = false;

  paciente: any = {};
  proveedor: any = {};
  cobertura: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialogRef: MatDialogRef<ModalDetalleProveedorComponent>,
  private referenciaService: ReferenciaService) { }

  ngOnInit() {
    this.loadDataProveedor();
  }

  setShowPaciente(value: boolean) {
    this.showPaciente = value;
  }

  getStyle(convenio) {
    if (convenio === 'SIN CONVENIO') return { 'color': 'red', 'font-weight': 'bold' };
    if (convenio === 'CON CONVENIO') return { 'color': '#00B09F', 'font-weight': 'bold' };
  }

  loadDataProveedor() {
    this.referenciaService.detalleProveedor(this.data.paramsDetalle)
    .subscribe((response) => {
      if (response && response.codErr === 0) {
        this.proveedor = response.proveedor;
        this.cobertura = response.cobertura;
        this.paciente = this.data.paciente;
      }
    });
  }

  tieneCobertura() {
    return this.cobertura != null && this.cobertura.length > 0 && this.cobertura[0].value != '';
  }

  close() {
    this.matDialogRef.close();
  }
}