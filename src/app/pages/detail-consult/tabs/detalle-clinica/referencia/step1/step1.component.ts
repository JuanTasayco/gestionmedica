import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { ReferenciaService } from '@shared/services/referencia.service';

import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'referencia-step-1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ReferenciaStep1Component implements OnInit {
  @Input() currentStep: number;
  @Input() origen: any;
  
  @Output() saveData = new EventEmitter();
  @Output() cancelSave = new EventEmitter();

  formularioStep1: FormGroup;

  tiposReferencia: any[] = [];
  condicionesPaciente: any[] = [];
  diagnosticosFiltrados: any[] = [];

  form: any = {};

  isEdit: boolean = true;
  
  constructor(private referenciaService: ReferenciaService, private consultaMedService: ConsultaMedicaService) {}
  
  ngOnInit() {
    this.initForm();
    this.loadMasters();
  }

  initForm() {
    this.formularioStep1 = new FormGroup({
      proveedorOrigen: new FormControl(this.origen.text),
      tipoReferencia: new FormControl('', Validators.required),
      condicionPaciente: new FormControl('', Validators.required),
      diagnosticoIngreso: new FormControl('', Validators.required)
    });

    this.formularioStep1.controls.diagnosticoIngreso.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value != null && value.length > 2) {
          this.cargarListaDiagnosticos(value);
        }
      })
    ).subscribe();
  }

  loadMasters() {
    this.cargarTipoReferencia();
    this.cargarCondicionPaciente();
  }

  cargarTipoReferencia() {
    const filters = { cFiltro: '3', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.tiposReferencia = response.listaFiltros;
      }
    });
  }

  cargarCondicionPaciente() {
    const filters = { cFiltro: '6', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.condicionesPaciente = response.listaFiltros;
      }
    });
  }

  cargarListaDiagnosticosReferencia(text: string) {
    const filters = { cFiltro: '7', modificador: text };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.diagnosticosFiltrados = response.listaFiltros;
      }
    });
  }

  cargarListaDiagnosticos(text: string) {
    this.consultaMedService.cargarListaDiagnosticos(text, "1", "30", "T")
    .subscribe((response: any) => {
      if (response) {
        this.diagnosticosFiltrados = response.data;
      }
    });
  }

  diagnosticoSeleccionada(event: any) {
    this.diagnosticosFiltrados = [];
  }

  onDisplaySearch(item: any) {
    return item ? item.text : '';
  }

  onDisplayDiagnosticoSearch(item: any) {
    return item ? item.descripcion : '';
  }

  closeNewReference() {
    if(this.currentStep > 1) this.isEdit = false;
    else this.cancelSave.emit();
  }

  saveStep() {
    this.isEdit = false;

    const data = {
      proveedorOrigen: this.origen.value,
      tipoReferencia: this.formularioStep1.get('tipoReferencia').value.value,
      condicionPaciente: this.formularioStep1.get('condicionPaciente').value.value,
      diagnosticoIngreso: this.formularioStep1.get('diagnosticoIngreso').value.codigo,
      nomDiagnosticoIngreso: this.formularioStep1.get('diagnosticoIngreso').value.descripcion
    };

    this.form = {
      proveedorOrigen: this.origen.text,
      tipoReferencia: this.formularioStep1.get('tipoReferencia').value,
      condicionPaciente: this.formularioStep1.get('condicionPaciente').value,
      diagnosticoIngreso: this.formularioStep1.get('diagnosticoIngreso').value
    }

    this.saveData.emit({data: data});
  }

  showEdit() {
    this.isEdit = true;

    this.formularioStep1.get('tipoReferencia').patchValue(this.form.tipoReferencia);
    this.formularioStep1.get('condicionPaciente').patchValue(this.form.condicionPaciente);
    this.formularioStep1.get('diagnosticoIngreso').patchValue(this.form.tipoReferencia);
  }
}