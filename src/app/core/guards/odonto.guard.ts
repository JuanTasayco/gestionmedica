import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { ESTADOS, ODONTOGRAM_TYPE, getOptions } from "@shared/helpers";
import { ConsultaMedicaService } from "@shared/services/consultas-medicas.service";
import { OdontogramaService } from "@shared/services/odontograma.service";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OdontoRouteGuard implements CanActivate {
  constructor(
    private router: Router,
    private consultaMedService: ConsultaMedicaService,
    private odontogramaService: OdontogramaService
  ) {}

  canActivate(routeSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
    const numeroConsulta = routeSnapshot.paramMap.get("numeroConsulta");
    return this.consultaMedService
      .getDetalleConsultaMedica(numeroConsulta)
      .pipe(
        map((data: any) => {
          console.log(data)
          if (data.data.indicadorOdontogica === ODONTOGRAM_TYPE.TYPE && data.data.estado !== ESTADOS.atendido) {
            this.odontogramaService.setData(data.data);
            return true;
          } else {
            this.router.navigate(
              [`/medical-appointments/detail/${numeroConsulta}`],
              { replaceUrl: true }
            );
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(
            [`/medical-appointments/detail/${numeroConsulta}`],
            { replaceUrl: true }
          );
          return of(false);
        })
      );
  }
}
