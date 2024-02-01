import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ODONTOGRAM_TYPE } from "@shared/helpers";
import { OdontogramaService } from "@shared/services/odontograma.service";
import { Observable, Subject, of } from "rxjs";
import {
  startWith,
  debounceTime,
  tap,
  takeUntil,
  filter,
  map,
  switchMap,
  mergeMap,
  toArray,
  shareReplay,
} from "rxjs/operators";

@Component({
  selector: "mapfre-odontogram-modal",
  templateUrl: "./odontogram-modal.component.html",
  styleUrls: ["./odontogram-modal.component.scss"],
})
export class OdontogramModalComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  @ViewChild("valueSearch") valueSearch;
  formSearch = new FormControl("");
  valoresFiltrados: any;
  private unsubscribe$ = new Subject();
  obsData: Observable<any>;
  odontograma: string;
  odontogramType = ODONTOGRAM_TYPE;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private odontogramaService: OdontogramaService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.odontograma = ODONTOGRAM_TYPE.HALLAZGOS;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.odontograma = this.data.tipo;
    if (this.odontograma === ODONTOGRAM_TYPE.HALLAZGOS) {
      const arrB = this.data.data;
      this.odontogramaService
        .cargarListaHallazgos(`N`, "1", "10", "T")
        .subscribe((arrA: any) => {
          this.valoresFiltrados = arrA.filter(
            (obj1: any) =>
              !arrB.some((obj2: any) => obj2.codigo === obj1.codigo)
          );
        });
      this.changeDetector.detectChanges();
      return;
    }

    this.formSearch.valueChanges
      .pipe(
        startWith(""),
        debounceTime(300),
        tap((value) => {
          if (value && value !== null && value.length > 2) {
            this._filter(value);
            this.changeDetector.detectChanges();
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  private _filter(value: string) {
    if (this.data.tipo === ODONTOGRAM_TYPE.DIAGNOSTICOS) {
      this.odontogramaService
        .cargarListaDiagnosticos(`N|${value.toUpperCase()}`, "1", "10", "T")
        .pipe(
          map((x: any) =>
            x.filter((f: any) =>
              f.descripcion.toUpperCase().includes(value.toUpperCase() ||  "") || f.codigo.toUpperCase().includes(value.toUpperCase() ||  "")
            )
          )
        ).subscribe((arrA: any) => {
          const arrB = this.data.data;
          this.valoresFiltrados = arrA.filter(
            (obj1: any) =>
              !arrB.some((obj2: any) => obj2.codigo === obj1.codigo)
          ) || [];
        });
    } else {
      this.odontogramaService
        .cargarListaProcedimientos(`T|S|${value.toUpperCase()}`, "1", "10", "T")
        .pipe(
          map((x: any) =>
            x.filter((f: any) =>
              f.descripcion.toUpperCase().includes(value.toUpperCase() || "")
            )
          )
        ).subscribe((arrA: any) => {
          const arrB = this.data.data;
          this.valoresFiltrados = arrA.filter(
            (obj1: any) =>
              !arrB.some((obj2: any) => obj2.codigo === obj1.codigo)
          ) || [];
        });
    }
  }

  valorSeleccionados(element: any) {
    const datos_filtrados = this.valoresFiltrados.filter(
      (f) => f.checked === true
    );
    this.data.data = datos_filtrados;
  }

  clearSearch() {
    this.formSearch.setValue("");
    this.valoresFiltrados = [];
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  listarDiagnosticos() {}

  listarHallazgos() {}

  toggleCheckbox(item: any) {
    item.checked = !item.checked;
  }
}
