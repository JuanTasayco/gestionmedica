import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { PdfViewerComponent } from '../custom-pdf-viewer/custom-pdf-viewer.component';

@Component({
  selector: 'search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss']
})

export class SearchDocumentComponent implements OnInit {
  success: any;
  diagnostico_FormControl = new FormControl('');
  listaDiagnosticos = [];
  diagnosticosFiltrados: Observable<Array<any>>;
  diagnostico : string;
  search : number = 0;
  valorBuscar : string;
  guiasPracticas = [];
  guiaVacia : boolean ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private modalRef: MatDialogRef<SearchDocumentComponent>, private consultaMedService : ConsultaMedicaService
              , private dialog: MatDialog, private eventTracker: EventTrackerService) { }

  ngOnInit() {
    //this.success = this.data.success;
    this.diagnostico_FormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      tap(value => {
            if (value && value != null && value.length > 2 ) {
                this.diagnostico = this.diagnostico_FormControl.value
                //console.log(this.diagnostico)
                this.buscarGuia(this.diagnostico);
            }
        }
      )
   ).subscribe();
  }

  redirect() {
    //this.modalRef.close();
  }

  cargarListaDiagnosticos(){
          
    this.consultaMedService.cargarListaDiagnosticos(this.diagnostico_FormControl.value, "1", "10", "T").
    subscribe((response: any) => {

          if (response) {
            this.listaDiagnosticos = response.data;
            this.diagnosticosFiltrados = this.diagnostico_FormControl.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filterDiagnostico(descripcion) : this.listaDiagnosticos.slice())
            );
          }
          
      });

  }

  private _filterDiagnostico(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaDiagnosticos.filter(diagnostico => diagnostico.descripcion.toLowerCase().includes(filterValue));
  }

  diagnosticoSeleccionado(event: MatAutocompleteSelectedEvent): void {  
    this.search = 1;
    this.diagnostico_FormControl.setValue(event.option.viewValue)
  }

  buscarGuia(valor:string){

    const request = {
      "pagina": 1,
      "tamanio": 10,
      "valor": valor
    }
    this.consultaMedService.listarGuiasPracticas( this.data , request )
        .subscribe((response: any) => {
            if (response != null) {
              if ( response.operacion == 200 ) {
                this.guiasPracticas = response.data;
              }   
            }else{
              this.guiaVacia = true;
              this.guiasPracticas = [];
            }    
    });

  }


  showComponentPDF(src : any){
    let dialogRef = this.dialog.open(PdfViewerComponent, {
      id:'pdf-view-dialog',
      height: '72vh'
    });

    let instance = dialogRef.componentInstance;
    instance.src = src;
    instance.originalSize = false;
    instance.autoresize = true;
    instance.fitToPage = true;
    instance.renderText = true;
    instance.showAll = true;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  activarBusqueda(value : any){
    this.guiaVacia = false;
    this.search = 0;
    if (value.length == 0) {
      this.guiasPracticas = []
    }
  }

  verGuia(ruta : string){
    this.eventTracker.postEventTracker("opc66",JSON.stringify({"nroConsulta":this.data})).subscribe()

    this.consultaMedService.obtenerGuiaPractica(this.data, ruta).subscribe(
      (response)=>{
    this.modalRef.close();

        if(response.data.base64){
          this.showComponentPDF('data:application/pdf;base64,'+ response.data.base64)
        }
      }
    )
  }
}
