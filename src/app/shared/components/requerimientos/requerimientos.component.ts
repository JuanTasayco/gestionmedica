import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { startWith, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'modal-requerimientos',
  templateUrl: './requerimientos.component.html',
  styleUrls: ['./requerimientos.component.scss']
})

export class RequerimientosComponent implements OnInit {
  servicios: any[] = [];
  imagenes: any[] = [];
  emergencias: any[] = [];
  especialidades: any[] = [];

  especialidadesFilter: any[] = [];

  especialidadesSelected: any[] = [];

  especialidadFormControl = new FormControl('');

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialogRef: MatDialogRef<RequerimientosComponent>) { }

  ngOnInit() {
    this.servicios = this.data.servicios;
    this.imagenes = this.data.imagenes;
    this.emergencias = this.data.emergencias;
    this.especialidades = this.data.especialidades;

    this.servicios.forEach((element) => {
      if (element.grupoRequerimiento === '13') {
      let old = this.data.selectedItems.find((item) => {
        return item.idRequerimiento == element.value;
      });
      
      if(!old) element.checkTest = false;
      else element.checkTest = true;
      }
    });

    this.imagenes.forEach((element) => {
      if (element.grupoRequerimiento === '14') {
      let old = this.data.selectedItems.find((item) => {
        return item.idRequerimiento == element.value;
      });
      
      if(!old) element.checkTest = false;
      else element.checkTest = true;
      }
    });

    this.emergencias.forEach((element) => {
      if (element.grupoRequerimiento === '15') {
      let old = this.data.selectedItems.find((item) => {
        return item.idRequerimiento == element.value;
      });
      
      if(!old) element.checkTest = false;
      else element.checkTest = true;
      }
    });

    let elements = this.data.selectedItems;

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].grupoRequerimiento === '16') {
        this.especialidadesSelected.push({
          grupoRequerimiento: '16',
          text: elements[i].nombreRequerimiento,
          value: elements[i].idRequerimiento
        })
      }
    }

    this.especialidadFormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(value => {
        if (value && value != null && value.length > 2) {
          this.buscarEspecialidades(value);
        }
      }
      )
    ).subscribe();
  }

  buscarEspecialidades(text: string) {
    const filter = text.toUpperCase();
    this.especialidadesFilter = this.especialidades.filter(option => option.text.includes(filter));
  }

  especialidadSeleccionada(event: any) {
    const data = { value: event.option.value, text: event.option.viewValue };
    this.especialidadesFilter = [];
    this.especialidadesSelected.push(data);
    this.especialidadFormControl.setValue('');
  }

  removeRequerimiento(index: number) {
    this.especialidadesSelected.splice(index, 1)
  }

  disabledSelect() {
    return this.especialidadesSelected.length === 0;
  }

  close() {
    this.matDialogRef.close();
  }

  save() {
    let list = [];

    this.servicios.forEach((v) => {
      if (v.checkTest) {
        list.push({
          grupoRequerimiento: '13',
          idRequerimiento: v.value,
          nombreRequerimiento: v.text
        });
      }
    });

    this.imagenes.forEach((v) => {
      if (v.checkTest) {
        list.push({
          grupoRequerimiento: '14',
          idRequerimiento: v.value,
          nombreRequerimiento: v.text
        });
      }
    });

    this.emergencias.forEach((v) => {
      if (v.checkTest) {
        list.push({
          grupoRequerimiento: '15',
          idRequerimiento: v.value,
          nombreRequerimiento: v.text
        });
      }
    });

    this.especialidadesSelected.forEach((v) => {
      list.push({
        grupoRequerimiento: '16',
        idRequerimiento: v.value,
        nombreRequerimiento: v.text
      });
    });

    this.matDialogRef.close(list);
  }
}