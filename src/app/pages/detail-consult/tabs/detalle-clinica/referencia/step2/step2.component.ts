import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { startWith, debounceTime, tap } from "rxjs/operators";

import { ReferenciaService } from "@shared/services/referencia.service";
import { RequerimientosComponent } from "@shared/components/requerimientos/requerimientos.component";
import { AlertComponent } from "@shared/components/alert/alert.component";
import { ModalDetalleProveedorComponent } from "@shared/components/modal-detalle-proveedor/modal-detalle-proveedor.component";

@Component({
  selector: 'referencia-step-2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ReferenciaStep2Component implements OnInit {
  @Input() currentStep: number;
  @Input() paciente: any;
  
  @Output() saveData = new EventEmitter();
  
  formularioStep2: FormGroup;
  formularioStep2_2: FormGroup;

  isEdit: boolean = true;

  forceDestino: boolean = false;

  departamentos: any[] = [];
  provincias: any[] = [];
  entidades: any[] = [];
  categorias: any[] = [];
  instituciones: any[] = [];
  convenios: any[] = [];
  coberturas: any[] = [];
  proveedores: any[] = [];

  servicios: any[] = [];
  imagenes: any[] = [];
  emergencias: any[] = [];
  especialidades: any[] = [];

  mediosTraslado: any[] = [];
  tiposTraslado: any[] = [];
  proveedoresTraslado: any[] = [];
  proveedoresTrasladoFilter: any[] = [];

  hideProveedor: boolean = false;

  selectedItems: any[] = [];

  ordenaCosto: boolean = false;
  ordenaRequerimiento: boolean = false;

  filters: any[] = [
    { value: 1, text: 'Proximidad' },
    { value: 2, text: 'Agrupación por costo' },
    { value: 3, text: 'Total de requerimientos' }
  ];
  filterView: number = 1;

  listResultsAll: any[] = [];
  listResults: any[] = [];
  noSearch: boolean = true;
  
  itemPerPage: number = 5;
  mPagination: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;

  form: any = {};
  
  constructor(private referenciaService: ReferenciaService, private dialog: MatDialog) {}
  
  ngOnInit() {
    this.initForm();
    this.loadMasters();
  }

  initForm() {
    this.formularioStep2 = new FormGroup({
      departamento: new FormControl(''),
      provincia: new FormControl(''),
      entidad: new FormControl(''),
      categoria: new FormControl(''),
      institucion: new FormControl(''),
      convenio: new FormControl(''),
      cobertura: new FormControl(''),
      proveedor: new FormControl('')
    });

    this.formularioStep2.controls.proveedor.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value !== null && value.length > 2) {
          this.searchCentroDestino(value);
        }
      })
    ).subscribe();

    this.formularioStep2_2 = new FormGroup({
      medioTraslado: new FormControl('', Validators.required),
      tipoTraslado: new FormControl('', Validators.required),
      proveedorTraslado: new FormControl('', Validators.required)
    })

    this.formularioStep2_2.controls.proveedorTraslado.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      tap(value => {
        if (value && value !== null && value.length > 2) {
          this.searchProveedorTralado(value);
        }
      })
    ).subscribe();
  }

  loadMasters() {
    this.cargarDepartamentos();
    this.cargarEntidades();
    this.cargarCategorias();
    this.cargarInstituciones();
    this.cargarConvenios();
    this.cargarCoberturas();
    this.cargarServicios();
    this.cargerImagenes();
    this.cargarEmergencias();
    this.cargarEspecialidades();
    this.cargarMediosTralasdo();
    this.cargarTiposTraslado();
    this.cargarProveedoresTraslado();
  }

  cargarDepartamentos() {
    const filters = { cFiltro: '1', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.departamentos = response.listaFiltros;
      }
    });
  }

  cargarEntidades() {
    const filters = { cFiltro: '9', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.entidades = response.listaFiltros;
      }
    });
  }

  cargarCategorias() {
    const filters = { cFiltro: '8', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.categorias = response.listaFiltros;
      }
    });
  }

  cargarInstituciones() {
    const filters = { cFiltro: '10', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.instituciones = response.listaFiltros;
      }
    });
  }

  cargarConvenios() {
    const filters = { cFiltro: '11', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.convenios = response.listaFiltros;
      }
    });
  }

  cargarCoberturas() {
    const filters = { cFiltro: '26', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.coberturas = response.listaFiltros;
      }
    });
  }

  cargarServicios() {
    const filters = { cFiltro: '13', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.servicios = response.listaFiltros;
      }
    });
  }

  cargerImagenes() {
    const filters = { cFiltro: '14', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.imagenes = response.listaFiltros;
      }
    });
  }

  cargarEmergencias() {
    const filters = { cFiltro: '15', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.emergencias = response.listaFiltros;
      }
    });
  }

  cargarEspecialidades() {
    const filters = { cFiltro: '16', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.especialidades = response.listaFiltros;
      }
    });
  }

  cargarMediosTralasdo() {
    const filters = { cFiltro: '17', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.mediosTraslado = response.listaFiltros;
      }
    });
  }

  cargarTiposTraslado() {
    const filters = { cFiltro: '18', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.tiposTraslado = response.listaFiltros;
      }
    });
  }

  cargarProveedoresTraslado() {
    const filters = { cFiltro: '21', modificador: '' };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.proveedoresTraslado = response.listaFiltros;
      }
    });
  }

  forzarProveedor() {
    this.formularioStep2.reset();
    this.provincias = [];
    this.selectedItems = [];
  }

  selectDepartamento(event: any) {
    const filters = { cFiltro: '2', modificador: event.value };
    this.referenciaService.getFiltros(filters)
    .subscribe((response) => {
      if(response && response.codErr === 0) {
        this.provincias = response.listaFiltros;
      }
    });
  }

  selectProvincia(event: any) {
    this.formularioStep2.get('proveedor').patchValue('');
  }

  searchCentroDestino(text: string) {
    const CDepartamento = this.formularioStep2.get('departamento').value !== '' ? this.formularioStep2.get('departamento').value : null;
    const CProvincia = this.formularioStep2.get('provincia').value !== '' ? this.formularioStep2.get('provincia').value : null;

    const filters = {
      CDep: CDepartamento,
      CProv: CProvincia,
      modificador: text
    };

    this.referenciaService.filterProveedor(filters)
    .subscribe((response) => {
      if (response && response.codErr === 0) {
        this.proveedores = response.listaFiltros;
      }
    })
  }

  centroDestinoSeleccionada(event: any) {
    this.proveedores = [];
  }

  onDisplaySearchCentroDestino(item: any) {
    return item ? item.text : '';
  }

  searchProveedorTralado(text: string) {
    const filter = text.toUpperCase();
    this.proveedoresTrasladoFilter = this.proveedoresTraslado.filter(option => option.text.includes(filter));
  }

  proveedorTraladoSeleccionada(event: any) {
    this.proveedoresTrasladoFilter = [];
  }

  onDisplaySearchProveedorTralado(item: any) {
    return item ? item.text : '';
  }

  showModalRequerimientos() {
    const dialogRef = this.dialog.open(RequerimientosComponent, {
      width: '900px',
      autoFocus: false,
      data: { selectedItems: this.selectedItems, servicios: this.servicios, imagenes: this.imagenes, emergencias: this.emergencias, especialidades: this.especialidades }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedItems = result;
      }
    });
  }

  removeRequerimiento(index: number, item: any) {
    if (item.grupoRequerimiento === '13') {
      this.servicios.forEach((element: any) => {
        if (element.value == item.idRequerimiento) {
          element.checkTest = false;
        }
      });
    }

    if (item.grupoRequerimiento === '14') {
      this.imagenes.forEach((element: any) => {
        if (element.value == item.idRequerimiento) {
          element.checkTest = false;
        }
      });
    }

    if (item.grupoRequerimiento === '15') {
      this.emergencias.forEach((element: any) => {
        if (element.value == item.idRequerimiento) {
          element.checkTest = false;
        }
      });
    }

    this.selectedItems.splice(index, 1);
  }

  cleanSearch() {
    this.noSearch = true;
    this.listResults = [];
    this.listResultsAll = [];
    this.selectedItems = [];
    this.formularioStep2.reset();
  }

  searchProveedor() {
    let tieneEspecialidad = false;
    this.selectedItems.forEach((v) => {
      tieneEspecialidad = v.grupoRequerimiento == 16;
    });

    let data = { title: '', message: '' };
    let hasError = true;

    if(!tieneEspecialidad && !this.forceDestino) {
      data.message = 'Para realizar la búsqueda de proveedor debe elegir al menos una especialidad.';
    } else if (this.selectedItems.length == 0 && !this.forceDestino) {
      data.message = 'Para realizar la búsqueda de proveedor debe elegir al menos un servicio.';
    } else if (this.formularioStep2.get('cobertura').value === '' && !this.forceDestino) {
      data.message = 'Para realizar la búsqueda de proveedor debe elegir una cobertura.'
    } else {
      hasError = false;
    }
    
    if(hasError){
      this.dialog.open(AlertComponent, { width: '400px', data: { alert: data } });
    } else {
      const CProveedorDestino = this.formularioStep2.get('proveedor').value !== '' ? this.formularioStep2.get('proveedor').value : null;
      const CProveedorOrigen = this.paciente.centroOrigen;
      const CDepartamento = this.formularioStep2.get('departamento').value !== '' ? this.formularioStep2.get('departamento').value : null;
      const CProvincia = this.formularioStep2.get('provincia').value !== '' ? this.formularioStep2.get('provincia').value : null;
      const CCategoria = this.formularioStep2.get('categoria').value !== '' ? this.formularioStep2.get('categoria').value : null;
      const CEntidad = this.formularioStep2.get('entidad').value !== '' ? this.formularioStep2.get('entidad').value : null;
      const CInstitucion = this.formularioStep2.get('institucion').value !== '' ? this.formularioStep2.get('institucion').value : null;
      const CConvenio = this.formularioStep2.get('convenio').value !== '' ? this.formularioStep2.get('convenio').value : null;
      const CCobertura = this.formularioStep2.get('cobertura').value !== '' ? this.formularioStep2.get('cobertura').value : null;

      const OrdenarRequerimiento = this.ordenaRequerimiento;
      const OrdenarCosto = this.ordenaCosto

      const idAfiliado = this.paciente.idAfiliado;
      const numContrato = this.paciente.numContrato;
      const tipoOrigen = this.paciente.tipoOrigen;

      const filters = {
        CProveedorOrigen: CProveedorOrigen,
        ListaRequerimientos: this.selectedItems,
        CDepartamento: CDepartamento,
        CProvincia: CProvincia,
        CCategoria: CCategoria,
        CEntidad: CEntidad,
        CInstitucion: CInstitucion,
        CConvenio: CConvenio,
        CCobertura: CCobertura,
        OrdenarRequerimiento: OrdenarRequerimiento,
        CProveedorDestino: CProveedorDestino,
        OrdenarCosto: OrdenarCosto,
        idAfiliado: idAfiliado,
        numContrato: numContrato,
        tipoOrigen: tipoOrigen
      };

      this.referenciaService.searchProveedores(filters)
      .subscribe((response: any) => {
        if (response && response.codErr == 0) {
          this.noSearch = false;

          this.listResultsAll = response.listaProveedores.map((element) => {
            const list = element.requerimientosCumple.filter((req) => {
              return req.cumpleRequerimiento;
            });

            element.cumple = list.length;
            return element;
          });

          this.pagination();
        }
      })
    };
  }

  selectFilter(event: any) {
    switch(event.value) {
      case 1:
        this.ordenaCosto = false;
        this.ordenaRequerimiento = false;
        break;
      case 2:
        this.ordenaCosto = true;
        this.ordenaRequerimiento = false;
        break;
      case 3:
        this.ordenaCosto = false;
        this.ordenaRequerimiento = true;
        break;
    }
    
    this.mPagination = 1;

    this.searchProveedor();
  }

  pagination() {
    let star = (this.mPagination - 1) * this.itemPerPage;
    let listAll = this.listResultsAll;
    this.totalItems = this.listResultsAll.length;
    this.listResults = listAll.slice(star, star + this.itemPerPage);
    const totalPages = this.totalItems / this.itemPerPage;
    if (totalPages < 1) this.totalPages = 1;
    else this.totalPages = Math.ceil(totalPages);
  }

  changePage(event: any) {
    this.mPagination = event.page;
    this.pagination();
  }

  selectTipoTraslado(event: any) {
    this.hideProveedor = event.value === '4';

    if(this.hideProveedor) {
      this.formularioStep2_2.get('proveedorTraslado').patchValue('');
      this.formularioStep2_2.get('proveedorTraslado').clearValidators();
    } else {
      this.formularioStep2_2.get('proveedorTraslado').setValidators(Validators.required);
    }

    this.formularioStep2_2.get('proveedorTraslado').updateValueAndValidity();
  }

  showModalDetalled(item: any) {
    const paciente = {};

    const paramsDetalle = {
      CProveedor: item.idProveedor,
      CAsegurado: this.paciente.idAfiliado,
      NumContrato: this.paciente.numContrato,
      CTipOrigAseg: this.paciente.tipoOrigen
    };

    this.dialog.open(ModalDetalleProveedorComponent, {
      width: '900px',
      autoFocus: false,
      data: { paciente, paramsDetalle }
    });
  }

  getStyle(convenio) {
    if (convenio == "SIN CONVENIO") return { color: "red" };
    if (convenio == "CON CONVENIO") return { color: "#00B09F" };
  }

  selectProveedorResult(item: any) {
    this.formularioStep2_2.get('medioTraslado').patchValue('');
    this.formularioStep2_2.get('tipoTraslado').patchValue('');
    this.formularioStep2_2.get('proveedorTraslado').patchValue('');

    this.formularioStep2_2.get('proveedorTraslado').setValidators(Validators.required);
    this.formularioStep2_2.get('proveedorTraslado').updateValueAndValidity();

    for (var i = 0; i < this.listResults.length; i++) {
      const prove = this.listResults[i];
      prove.showProveedor = prove.idProveedor == item.idProveedor;
    }
  }
  
  showCancel() {
    return this.currentStep > 2;
  }

  cancel() {
    this.isEdit = false;
  }

  saveStep(item: any) {
    this.isEdit = false;

    const data = {
      forceDestino: this.forceDestino,
      listChecked: this.selectedItems,
      medioTraslado: this.formularioStep2_2.get('medioTraslado').value,
      tipoTraslado: this.formularioStep2_2.get('tipoTraslado').value,
      proveedorTraslado: this.formularioStep2_2.get('proveedorTraslado').value.value,
      idProveedor: item.idProveedor
    };

    this.form = {
      Nombre: item.nombre,
      Categoria: item.categoria,
      Direccion: item.direccion,
      Institucion: item.institucion,
      Convenio: item.convenio
    };

    this.saveData.emit({data: data});
  }

  showEdit() {
    this.isEdit = true;

    this.forceDestino = false;
    this.noSearch = true;
    this.listResults = [];
    this.listResultsAll = [];
    this.formularioStep2.reset();
  }
}