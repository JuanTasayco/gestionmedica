import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_URL_DATA_AUX , BASE_DATE_FORMAT_API, BASE_DATE_FORMAT } from '../../../shared/helpers/constants';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfesionalService } from '@shared/services/profesional.service';
import * as moment from 'moment';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'mapfre-professionals',
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.scss']
})
export class ProfessionalsComponent implements OnInit {
  pagination = 1;
  totalItems = 0;
  isFilterVisible: boolean;
  totalPages = 0;
  totalItemsPage = 10;
  formGroupSearchDocuments: FormGroup;
  profesionales = [];

  constructor(private router: Router, private profesionalService: ProfesionalService,private eventTracker: EventTrackerService) {
    this.eventTracker.postEventTracker("opc72", "").subscribe()
  }

  ngOnInit() {
    this.initComponents();
    this.formGroupSearchDocuments = new FormGroup({
      profesional: new FormControl(''),
      fecha_desde: new FormControl(''),
      gender: new FormControl('')
    });
  }

  @HostListener('window:resize')
  onResize() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      this.isFilterVisible = false;
      element.style.top = 'auto';
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      element.style.top = heightDevice - 70 + 'px';
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      }
    }
  }
  
  operationsDetail() {
    this.eventTracker.postEventTracker("opc74", "").subscribe()
  
    this.router.navigate([PATH_URL_DATA_AUX[3]]);
  }

  navigateToProfessionalDetail(item: string, p: any) {
    this.eventTracker.postEventTracker("opc79", JSON.stringify(p)).subscribe()
   
    var path = PATH_URL_DATA_AUX[1];
    this.router.navigate([path, item], { replaceUrl: false });
  }

  formGroupSearchDocumentsSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
    this.toggleFilter();
  }

  toggleFilter() {
    const isDesktop = window.innerWidth > 991;
    if (isDesktop) {
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      return;
    } else {
      this.isFilterVisible = !this.isFilterVisible;
      if (this.isFilterVisible) {
        document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      }
    }
  }

  clean() {
    this.formGroupSearchDocuments.reset();
  }

  changePage(event) {
    this.search(event.page);
  }
  
  search(numPagina:string) {
    const request = {
      pagina: numPagina,
      tamanio: this.totalItemsPage,
      fechaNacimiento: this.formGroupSearchDocuments.controls.fecha_desde.value ?
      moment(this.formGroupSearchDocuments.controls.fecha_desde.value).format(BASE_DATE_FORMAT_API) : '',
      genero: this.formGroupSearchDocuments.controls.gender.value ? this.formGroupSearchDocuments.controls.gender.value : '',
      valor: this.formGroupSearchDocuments.controls.profesional.value ? this.formGroupSearchDocuments.controls.profesional.value : ''
    };

    const filtro = {
      "fechaNacimiento: " :  request.fechaNacimiento,
      "genero: " :  request.genero,
      "valor: " : request.valor
    }

    this.eventTracker.postEventTracker("opc73", JSON.stringify(filtro)).subscribe()
  
  
    this.profesionalService.getProfesionalesSalud(request)
      .subscribe((response: any) => {
        if (response) {

        for (let index = 0; index < response.data.length; index++) {
          response.data[index]['fechaNacimiento'] 
          = moment(response.data[index]['fechaNacimiento']).format(BASE_DATE_FORMAT);
        }
  
        this.profesionales = response.data;
        this.pagination = +numPagina;
        this.totalItems = response.numeroRegistros;
        const totalPages = Math.ceil(response.numeroRegistros / this.totalItemsPage);
        if (totalPages < 1) { this.totalPages = 1; }
        if (totalPages >= 1) { this.totalPages = Math.ceil(totalPages); }
        }else{
          console.log('--')
          this.profesionales = [];
        }
        
    });
  }

  initComponents() {
    const isDesktop = window.innerWidth > 991;
    const heightDevice = window.innerHeight;
    const element = document.getElementById('filterBox') as HTMLInputElement;
    if (isDesktop) {
      element.style.top = 'auto';
    } else {
      element.style.top = heightDevice - 70 + 'px';
    }
  }

}
