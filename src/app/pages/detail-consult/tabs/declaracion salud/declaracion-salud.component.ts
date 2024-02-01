import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { EventTrackerService } from "@shared/services/event-tracker.service";

@Component({
    selector: 'mantenimiento-tab-declaracion-salud',
    templateUrl: './declaracion-salud.component.html',
    styleUrls: ['../../detail-consult.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  
  export class TabDeclaracionSaludComponent implements OnInit {
    data_consulta = [];
    declaracion : any;
    constructor( private consultaMedService : ConsultaMedicaService, private route:ActivatedRoute, private eventTracker: EventTrackerService) {} 

      ngOnInit(){
        this.eventTracker.postEventTracker("opc71", "").subscribe()
        this.obtenerDeclaracionSalud();
      }

      obtenerDeclaracionSalud(){
        let numeroConsulta= this.route.snapshot.paramMap.get('numeroConsulta')
        this.consultaMedService.obtenerDeclaracionSalud( +numeroConsulta )
        .subscribe((response: any) => {
            if ( response.operacion == 200  ) {
              this.declaracion = response.data                 
            }       
        });

      }
  }