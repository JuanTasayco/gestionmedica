import { forEach } from "@angular/router/src/utils/collection";

export class DetalleRequest {
  public static _mapApoyoActualizar(data: any): any {
    let apoyoActualizar: any = [];
    data.forEach((d) => {
      apoyoActualizar.push({
        id: +d.numeroMovimiento,
        codigoDiagnostico: d.codeDiagnostico,
        codigoProcedimiento: d.code,
        cantidad: d.cantidad,
        realizado: "S",
        interno: d.interno,
      });
    });
    return apoyoActualizar;
  }

  public static _mapApoyoGuardar(data: Array<any>): any {
    let apoyoGuardar: any = [];
    data.map((d: any) => {
      apoyoGuardar.push({
        codigoDiagnostico: d["codeDiagnostico"],
        codigoProcedimiento: d["code"],
        cantidad: d["cantidad"],
        realizado: "N",
        interno: d["interno"],
      });
    });
    return apoyoGuardar;
  }

  public static _mapProcedimientoActualizar(data: any): any {
    let apoyoActualizar: any = [];
    data.forEach((d) => {
      apoyoActualizar.push({
        id: +d.numeroMovimiento,
        codigoDiagnostico: d.codeDiagnostico,
        codigoProcedimiento: d.code,
        cantidad: d.cantidad,
        realizado: "S",
        interno: d.interno,
      });
    });
    return apoyoActualizar;
  }

  public static _mapProcedimientoGuardar(data: Array<any>): any {
    let apoyoGuardar: any = [];
    data.map((d: any) => {
      apoyoGuardar.push({
        codigoDiagnostico: d["codeDiagnostico"],
        codigoProcedimiento: d["code"],
        cantidad: d["cantidad"],
        realizado: "N",
        interno: d["interno"],
      });
    });
    return apoyoGuardar;
  }

  public static _mapMedicamentoActualizar(data: any): any {
    let medicamentoActualizar: any = [];
    data.forEach((d) => {
      medicamentoActualizar.push({
        id: d["numeroMovimiento"],
        codigoDiagnostico: d["codeDiagnostico"],
        codigoMedicamento: d["code"],
        dosis: +d["dosis"],
        unidadMedidaDosis: d["unidadMedidaDosis"],
        frecuencia: +d["frecuencia"],
        unidadMedidaFrecuencia: d["unidadMedidaFrecuencia"],
        duracion: +d["duracion"],
        unidadMedidaDuracion: d["unidadMedidaDuracion"],
        cantidadProducto: d["cantidadProducto"],
        indicacionMedica: d["indicacionMedica"],
      });
    });
    return medicamentoActualizar;
  }

  public static _mapMedicamentoGuardar(data: Array<any>): any {
    let medicamentoGuardar: any = [];
    data.map((d: any) => {
      medicamentoGuardar.push({
        codigoDiagnostico: d["codeDiagnostico"],
        codigoMedicamento: d["code"],
        dosis: +d["dosis"],
        unidadMedidaDosis: d["unidadMedidaDosis"],
        frecuencia: +d["frecuencia"],
        unidadMedidaFrecuencia: d["unidadMedidaFrecuencia"],
        duracion: +d["duracion"],
        unidadMedidaDuracion: d["unidadMedidaDuracion"],
        cantidadProducto: d["cantidadProducto"],
        indicacionMedica: d["indicacionMedica"],
      });
    });
    return medicamentoGuardar;
  }
}
