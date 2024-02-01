import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import { EventTracker } from '@shared/helpers/constants-event-tracker';
import { ReportsProServService } from '@pages/reports-pro-serv/service/reports-pro-serv.service';


@Injectable({ providedIn: 'root' })
export class EventTrackerService {
    arrTracker: EventTracker[] = [];

    constructor(private dataService: DataService, private reportsProServService: ReportsProServService,) { }

    postEventTracker(identity: string, arrFilter: string) {
        const tackerJson = JSON.parse(localStorage.getItem("tracker"));
        this.arrTracker = tackerJson;

        const body = this.arrTracker.filter(p => p.identity == identity);
        body[0].filtros = arrFilter;
        const pathService = environment.urlEventTracker;
        this.dataService.set(pathService);

        return this.dataService.execPostJson(body[0]);
    }

    setTracker() {
        // this.reportsProServService.getIp().subscribe(
        //     response => {
                const ip = '';
                const codigoUsuario = JSON.parse(localStorage.getItem('profile')).username;
                this.setTrackerJson("opc0", ip, "I", "HOME", "Ingreso al módulo", "Click al módulo", "", codigoUsuario);
                this.setTrackerJson("opc1", ip, "I", "HOME", "Ingreso a opción Carga Documentos", "Click al botón Carga Documentos", "", codigoUsuario);
                this.setTrackerJson("opc2", ip, "I", "BANDEJA DE DOCUMENTOS", "Opción búsqueda bandeja", "Click al Botón en el botón buscar", "", codigoUsuario);
                this.setTrackerJson("opc3", ip, "I", "BANDEJA DE DOCUMENTOS", "Opción Cargar documentos", "Click al Botón en el botón Carga Documentos", "", codigoUsuario);
                this.setTrackerJson("opc4", ip, "I", "PANTALLA CARGA DOCUMENTOS", "Opción botón cargar", "Click al Botón en el botón Cargar", "", codigoUsuario);
                this.setTrackerJson("opc5", ip, "I", "BANDEJA DE DOCUMENTOS", "Opción ver detalle", "Click en la flecha del detalle", "", codigoUsuario);
                this.setTrackerJson("opc6", ip, "I", "CARGA DOCUMENTOS / PANTALLA DETALLE DOCUMENTO", "Opción firmar documentos", "Click al Botón en el botón firmar documento", "", codigoUsuario);
                this.setTrackerJson("opc7", ip, "I", "CARGA DOCUMENTOS / PANTALLA DETALLE DOCUMENTO", "Opción imprimir documentos", "Click en el ícono imprimir documento", "", codigoUsuario);
                this.setTrackerJson("opc8", ip, "I", "CARGA DOCUMENTOS / PANTALLA DETALLE DOCUMENTO", "Opción descargar documentos", "Click en el ícono descargar documento", "", codigoUsuario);
                this.setTrackerJson("opc9", ip, "I", "HOME", "Ingreso a opción bandeja historia clínicas", "Click al botón Historia Clínicas", "", codigoUsuario);
                this.setTrackerJson("opc10", ip, "I", "BANDEJA DE HISTORIA CLÍNICA", "Opción búsqueda bandeja", "Click al Botón en el botón buscar", "", codigoUsuario);
                this.setTrackerJson("opc11", ip, "I", "BANDEJA DE HISTORIA CLÍNICA", "Opción ver detalle", "Click en la flecha del detalle", "", codigoUsuario);
                this.setTrackerJson("opc12", ip, "I", "PANTALLA DETALLE DOCUMENTO", "Opción imprimir documentos", "Click al Botón en el ícono imprimir documento", "", codigoUsuario);
                this.setTrackerJson("opc13", ip, "I", "PANTALLA DETALLE DOCUMENTO", "Opción descargar documentos", "Click al Botón en el ícono descargar documento", "", codigoUsuario);

                this.setTrackerJson("opc14", ip, "I", "BANDEJA DE HISTORIA CLÍNICA", "Opción imprimir documentos", "Click al Botón en el ícono imprimir documento", "", codigoUsuario);
                this.setTrackerJson("opc15", ip, "I", "BANDEJA DE HISTORIA CLÍNICA", "Opción descargar documentos", "Click al Botón en el ícono descargar documento", "", codigoUsuario);

                this.setTrackerJson("opc16", ip, "I", "HOME", "Ingreso a opción Informes de pro y ser", "Click al botón Informenes de procedimientos y servicios", "", codigoUsuario);
                this.setTrackerJson("opc17", ip, "I", "BANDEJA DE INFORMENES de PROC y SER", "Opción búsqueda bandeja", "Click al Botón en el botón buscar", "", codigoUsuario);
                this.setTrackerJson("opc18", ip, "I", "BANDEJA DE INFORMENES de PROC y SER", "Opción ver detalle", "Click en la flecha ver informe", "", codigoUsuario);

                this.setTrackerJson("opc19", ip, "I", "INFORMENES de PROC y SER/PANTALLA DETALLE DOCUMENTO", "Opción eliminar documentos", "Click al ícono eliminar", "", codigoUsuario);
                this.setTrackerJson("opc20", ip, "I", "INFORMENES de PROC y SER/PANTALLA DETALLE DOCUMENTO", "Opción firmar documentos", "Click al Botón firmar documento", "", codigoUsuario);
                this.setTrackerJson("opc21", ip, "I", "INFORMENES de PROC y SER/PANTALLA DETALLE DOCUMENTO", "Opción editar documentos", "Click al ícono editar", "", codigoUsuario);

                this.setTrackerJson("opc22", ip, "I", "BANDEJA DE INFORMENES de PROC y SER", "Opción eliminar documentos", "Click al ícono eliminar", "", codigoUsuario);
                this.setTrackerJson("opc23", ip, "I", "BANDEJA DE INFORMENES de PROC y SER", "Opción descargar documentos firmados", "Click al ícono descargar", "", codigoUsuario);
                this.setTrackerJson("opc24", ip, "I", "BANDEJA DE INFORMENES de PROC y SER", "Opción nuevo informe médico", "Click al botón Nuevo informe médico", "", codigoUsuario);

                this.setTrackerJson("opc25", ip, "I", "BANDEJA NUEVO INFORME MÉDICO", "Opción nuevo informe médico", "Click al botón buscar", "", codigoUsuario);
                this.setTrackerJson("opc26", ip, "I", "BANDEJA NUEVO INFORME MÉDICO", "Opción continuar", "Click al botón Continuar", "", codigoUsuario);

                this.setTrackerJson("opc27", ip, "I", "INFORMES PROC Y SERC / PANTALLA DETALLE DOCUMENTO", "Opción generar plantilla", "Click al botón Generar Plantilla", "", codigoUsuario);
                this.setTrackerJson("opc28", ip, "I", "INFORMES PROC Y SERC / PANTALLA DETALLE DOCUMENTO", "Opción usar plantilla", "Click al botón Usar Plantilla", "", codigoUsuario);
                this.setTrackerJson("opc29", ip, "I", "INFORMES PROC Y SERC / PANTALLA DETALLE DOCUMENTO", "Opción búsqueda de plantilla", "Click al botón Búsqueda Plantilla", "", codigoUsuario);
                this.setTrackerJson("opc30", ip, "I", "INFORMES PROC Y SERC / PANTALLA DETALLE DOCUMENTO", "Opción guardar plantilla", "Click al botón Guardar", "", codigoUsuario);
                this.setTrackerJson("opc31", ip, "I", "INFORMES PROC Y SERC / PANTALLA DETALLE DOCUMENTO", "Opción firmar documentos", "Click al botón Firmar", "", codigoUsuario);

                this.setTrackerJson("opc32", ip, "I", "BANDEJA CONSULTA MÉDICA", "Ingresa a opción", "Click al botón Bandeja consulta médica", "", codigoUsuario);
                this.setTrackerJson("opc33", ip, "I", "BANDEJA CONSULTA MÉDICA", "Opción búsqueda consulta médica", "Click al botón Buscar", "", codigoUsuario);
                this.setTrackerJson("opc34", ip, "I", "BANDEJA CONSULTA MÉDICA", "Opción anular consulta", "Click al botón anular consulta", "", codigoUsuario);
                this.setTrackerJson("opc35", ip, "I", "BANDEJA CONSULTA MÉDICA", "Opción ir a Genesis", "Click al botón Ir a Génesis", "", codigoUsuario);
                this.setTrackerJson("opc36", ip, "I", "BANDEJA CONSULTA MÉDICA", "Opción flecha ver detalle", "Click a la flecha detalle", "", codigoUsuario);
                this.setTrackerJson("opc37", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción búsqueda de dx", "Click al botón Búsqueda", "", codigoUsuario);
                this.setTrackerJson("opc38", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción eliminar dx", "Click al botón Eliminar Dx", "", codigoUsuario);
                this.setTrackerJson("opc39", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción búsqueda servicio", "Click al botón Búsqueda", "", codigoUsuario);
                this.setTrackerJson("opc40", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción eliminar servicio", "Click al botón Eliminar Servicio", "", codigoUsuario);
                this.setTrackerJson("opc41", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción ícono generar PDF servicio", "Click al ícono generar PDF", "", codigoUsuario);
                this.setTrackerJson("opc42", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción búsqueda de procedimiento", "Click al botón búsqueda", "", codigoUsuario);
                this.setTrackerJson("opc43", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción eliminar procedimiento", "Click al botón Eliminar", "", codigoUsuario);
                this.setTrackerJson("opc44", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF procedimiento", "Click al ícono Generar PDF", "", codigoUsuario);
                this.setTrackerJson("opc45", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción búsqueda receta", "Click al botón búsqueda", "", codigoUsuario);
                this.setTrackerJson("opc46", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción eliminar receta", "Click al botón eliminar", "", codigoUsuario);
                this.setTrackerJson("opc47", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF", "Click al ícono Generar PDF", "", codigoUsuario);
                 this.setTrackerJson("opc48", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción Editar", "Click al ícono Editar", "", codigoUsuario);
                this.setTrackerJson("opc49", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción descanso médico", "Click al botón generar Descanso médico", "", codigoUsuario);
                this.setTrackerJson("opc50", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción ventana de días descanso médico", "Click al botón regitrar", "", codigoUsuario);
                this.setTrackerJson("opc51", ip, "I", "PANTALLA DETALLE CONSULTA","Opción registrar descanso", "Click al botón Registrar Descanso", "", codigoUsuario);
                this.setTrackerJson("opc52", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción agregar referencia", "Click al botón Agregar Referencia", "", codigoUsuario);
                this.setTrackerJson("opc53", ip, "I", "PANTALLA REFERENCIA", "Opción agregar referencia", "Click al botón Agregar Referencia", "", codigoUsuario);
                this.setTrackerJson("opc54", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción guardar consulta", "Click al botón Guardar Consulta", "", codigoUsuario);
                this.setTrackerJson("opc55", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción finalizar consulta", "Click al botón Finalizar Consulta", "", codigoUsuario);
             this.setTrackerJson("opc56", ip, "I", "PANTALLA TOKEN", "Opción enviar token", "Click al botón Enviar Token", "", codigoUsuario);
                this.setTrackerJson("opc57", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar descanso médico", "Click al ícono generar descanso médico", "", codigoUsuario);
                this.setTrackerJson("opc58", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF constancia", "Click al ícono Generar Constancia", "", codigoUsuario);
                this.setTrackerJson("opc59", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción firmar documentos", "Click al botón Firmar", "", codigoUsuario);
                 this.setTrackerJson("opc60", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar token", "Click al botón Firmar", "", codigoUsuario);
                 this.setTrackerJson("opc61", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF", "Click al botón Firmar", "", codigoUsuario);
                this.setTrackerJson("opc62", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF episodio", "Click al ícono Episodio", "", codigoUsuario);
                this.setTrackerJson("opc63", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF historia", "Click al ícono Historia", "", codigoUsuario);
                this.setTrackerJson("opc64", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción generar PDF guia práctica", "Click al ícono Guia Práctica", "", codigoUsuario);
                this.setTrackerJson("opc65", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción búsqueda guía práctica", "Click al ícono Búsqueda Guía Práctica", "", codigoUsuario);
             this.setTrackerJson("opc66", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción ver guía práctica", "Click al botón ver guía práctica ", "", codigoUsuario);
                this.setTrackerJson("opc67", ip, "I", "PANTALLA DETALLE CONSULTA", "Opción anular consulta", "Click al botón Anular", "", codigoUsuario);
                this.setTrackerJson("opc68", ip, "I", "PANTALLA DETALLE CONSULTA-HISTORIAL DE ATENCIONES", "Opción buscar", "Click al botón buscar", "", codigoUsuario);
                this.setTrackerJson("opc69", ip, "I", "PANTALLA DETALLE CONSULTA-HISTORIAL DE ATENCIONES", "Opción ver detalle", "Click a la flecha Ver Detalle", "", codigoUsuario);
                this.setTrackerJson("opc70", ip, "I", "PANTALLA FILICAIÓN", "Opción guardar filiación", "Click al botón Guardar filiacion", "", codigoUsuario);
                this.setTrackerJson("opc70.1", ip, "I", "PANTALLA FILICAIÓN", "Opción guardar historia clínica", "Click al botón Guardar", "", codigoUsuario);

                this.setTrackerJson("opc71", ip, "I", "PANTALLA DECLARACIÓN SALUD", "Opción declaración salud", "Click al tab Declaración Salud", "", codigoUsuario);

                this.setTrackerJson("opc72", ip, "I", "HOME GESTIÓN MÉDICA", "Opción mantenimientos - profesionales de la slud", "Click al botón Profesionales a la Salud", "", codigoUsuario);
                this.setTrackerJson("opc73", ip, "I", "PANTALLA BANDEJA PROFESIONALES DE LA SALUD", "Opción búsqueda", "Click al botón Buscar", "", codigoUsuario);
                this.setTrackerJson("opc74", ip, "I", "PANTALLA BANDEJA PROFESIONALES DE LA SALUD", "Opción nuevo profesional", "Click al botón Nuevo Profesional de la salud", "", codigoUsuario);
                this.setTrackerJson("opc75", ip, "I", "PANTALLA NUEVO PROFESIONALES DE LA SALUD", "Opción registrar", "Click al botón registrar", "", codigoUsuario);
                this.setTrackerJson("opc76", ip, "I", "PANTALLA NUEVO PROFESIONALES DE LA SALUD", "Opción cargar rúbrica del médico", "Click al botón Cargar rúbrica del médico", "", codigoUsuario);
                this.setTrackerJson("opc77", ip, "I", "PANTALLA NUEVO PROFESIONALES DE LA SALUD", "Opción búsqueda de especialidad", "Click al botón Búsqueda de especialidad", "", codigoUsuario);
                this.setTrackerJson("opc78", ip, "I", "PANTALLA NUEVO PROFESIONALES DE LA SALUD", "Opción Eliminar Especialidad", "Click al ícono eliminar especialidad", "", codigoUsuario);
                this.setTrackerJson("opc79", ip, "I", "PANTALLA EDITAR PROFESIONALES DE LA SALUD", "Opción flecha ver detalle", "Click a la flecha Ver  Detalle", "", codigoUsuario);
                this.setTrackerJson("opc80", ip, "I", "PANTALLA EDITAR PROFESIONALES DE LA SALUD", "Opción editar", "Click al ícono Editar", "", codigoUsuario);
                this.setTrackerJson("opc81", ip, "I", "PANTALLA EDITAR PROFESIONALES DE LA SALUD", "Opción cargar rúbrica del médico", "Click en botón Cargar Rúbrica", "",codigoUsuario);

                this.setTrackerJson("opc82", ip, "I", "PANTALLA DATOS GENERALES", "Opción búsqueda de horarios del médico", "Click al botón filtrar", "", codigoUsuario);
                this.setTrackerJson("opc83", ip, "I", "PANTALLA DATOS GENERALES", "Opción eliminar horario médico", "Click al ícono eliminar", "", codigoUsuario);
                this.setTrackerJson("opc84", ip, "I", "PANTALLA DATOS GENERALES", "Opción aplicar horario", "Click al botón Aplicar Horario", "", codigoUsuario);
                this.setTrackerJson("opc85", ip, "I", "HOME", "Cerrar sesión", "Click a cerrar sesión", "", codigoUsuario);


                localStorage.setItem("tracker", JSON.stringify(this.arrTracker));
                this.postEventTracker("opc0","").subscribe();
        //     }
        // )



    }

    setTrackerJson(idenity, ip, tipoRegistro, codigoObjeto, opcionMenu, descripcionOperacion, filtros, codigoUsuario) {

        this.arrTracker.push({
            identity: idenity,
            codigoAplicacion: "GESMED",
            ipOrigen: ip,
            tipoRegistro: tipoRegistro,
            codigoObjeto: codigoObjeto,
            opcionMenu: opcionMenu,
            descripcionOperacion: descripcionOperacion,
            filtros: filtros,
            codigoUsuario: codigoUsuario,
            numeroSesion: "",
            codigoAgente: 0,
        })
    }
}
