import { IMessageRoute, ICrumb, IAlerta } from '@shared/models/common/interfaces';

export const MIN_CHARACTERS_SEARCH = 3;

export const BASE_DATE_FORMAT = 'DD/MM/YYYY';
export const BASE_DATE_FORMAT_API = 'YYYY-MM-DD';

export const TIMER_REQUEST = 50000;

export const PATH_IP_SERVICE = 'https://api.ipify.org/?format=json';

export const HTTP_CREATED = 201;
export const HTTP_NO_CONTENT = 204;
export const HTTP_ACCEPTED = 202;
export const HTTP_METHOD_NOT_ALLOWED = 405;


/** ROLES */
export const ROLE_MEDIC = 'MEDICO';
export const ROLE_ADMIN = 'ADMINISTRADOR';
export const ROLE_PERSADMINIS = 'PERSADMINIS';
export const ROLE_ADMISIONISTA = 'ADMISIONISTA';
export const ROLE_NURSE = 'ENFERMERO';


/** CODIGO APLICACION */
export const APP_GESMED = 'GESMED';

/** OPCIONES */



export const DEFAULT_FILENAME = 'Documento';

export const PATH_SERVICE: BaseUrlConstants = {
    urlRegistrarProfesional2 : 'gestionMedica/medico',
    comun : 'comun/',
    perfil: 'perfil',
    documentosFiltro:'documento/filtro',
    correo: '/correo',
    descarga: 'descarga',
    detalle: '/detalle',
    documento: 'documento/',
    medico: 'medico/',
    sedes: '/sedes',
    sede: '/sede/',
    especialidades: '/especialidades',
    historiaClinicas: 'historiaClinica',
    firmar: '/firmar',
    usuario: 'usuario/',
    rol: 'rol',
    urlListaDiagnostico : 'consultaMedica/comun/DIAGNOSTICO',
    urlListaProcedimientos: 'consultaMedica/comun/PROCEDIMIENTO',
    urlComunCronicos : 'comunCronicos/',
    urlProfessionalsSearch : 'medico/busqueda',
    urlRegistrarProfesional : 'medico',
    urlListaRecetas : 'consultaMedica/comun/RECETA',
    urlListaServApoyo : 'consultaMedica/comun/APOYO_DIAGNOSTICO',
    urlConsultaMedica : 'consultaMedica/busqueda',
    urlGuardarDetalle : 'consultaMedica/',
    urlInformesProcServ:'informeprocedimientoservicio/',
    urlGuardarPedido: 'consultaMedica/',
    urlHLSeven: 'HL7',
    urlListaHallazgo : 'consultaMedica/comun/HALLAZGO',
    urlListaHallazgoOdontologico : 'consultaMedica/comun/HALLAZGO',
    urlListaProcedimientoOdontologico : 'consultaMedica/comun/PROCEDIMIENTO_ODONTOLOGICO',
    urlListaDiagnosticoOdontologico : 'consultaMedica/comun/DIAGNOSTICO_ODONTOLOGICO',
    urlConsultaMedicaUdontograma : 'consultaMedica/',
    urlListaSiglas: 'consultaMedica/comun/SIGLAS'
};

export const PATH_SERVICE_REFERENCIA = {
    nuevaReferencia: 'api/referencia/nueva',
    detalleReferencia: 'api/referencia/detalle',
    getReferenciaPDF: 'api/referencia/detallePDF',

    filtros: 'api/filtro',
    filtrarProveedor: 'api/proveedor/filtro',
    buscarProveedores: 'api/proveedor/buscar',
    detalleProveedor: 'api/proveedor/detalle'
};

export const PATH_URL_DATA_AUX: Array<string> = [
    'professionals-detail/:codMedico',
    'professionals-detail',
    'professionals',
    'new-profesional',
    'edit-profesional/:codMedico',
    'edit-profesional'
];


export const PATH_URL_DATA: BaseUrlConstants = {
    urlBandejaDocumento: 'bandeja-documentos',
    urlBandejaHistorias: 'bandeja-historias',
    urlDetalleDocumento: ':tipoModulo/detalle-documentos/:compania/:numeroConsulta/:codigoItem/:numeroItem',
    urlHistorialDocumento: 'historial-documentos',
    urlCargarDocumento : ':tipoModulo/cargar-documentos',
    urlMensaje: 'mensaje',
    ulrError: 'error',
    urlDefault: 'gestionmedica',
    urlDefault2: '**',
    urlMaintenance: 'maintenance',
    urlMedicalAppointments: 'medical-appointments',
    urlMedicalAppointmentsDetail: 'medical-appointments/detail/:numeroConsulta',
    urlProfessionals: 'professionals',
    urlNewProfessional: 'maintenance/professionals/new',
    urlEditProfessional: 'maintenance/professionals/edit/:codMedico',
    urlInformesProcServ     : 'informes-proc-serv',
    urlNuevoInforme         : 'nuevo-informe',
    urlDetalleInforme       : 'detalle-informe'
};

export class BaseUrlConstants{
    urlRegistrarProfesional2?:string;
    comun?: string;
    perfil?: string;
    documentosFiltro?: string;
    correo?: string;
    descarga?: string;
    detalle?: string;
    documento?: string;
    medico?: string;
    sedes?: string;
    sede?: string;
    especialidades? : string;
    historiaClinicas?: string;
    urlBandejaDocumento?: string;
    urlBandejaHistorias?: string;
    urlDetalleDocumento?: string;
    urlHistorialDocumento?: string;
    urlCargarDocumento?: string;
    urlMensaje?: string;
    ulrError?: string;
    urlDefault?: string;
    urlDefault2?: string;
    firmar?: string;
    usuario?: string;
    rol?: string;
    urlInformesProcServ?    : string;
    urlNuevoInforme?        : string;
    urlDetalleInforme?      : string;
    urlMaintenance?: string;
    urlMedicalAppointments?: string;
    urlMedicalAppointmentsDetail? : string;
    urlProfessionals?: string;
    urlProfessionalDetail?: string;
    urlNewProfessional?: string;
    urlComunCronicos?: string;
    urlEditProfessional?:string;
    //bandeja de consulta medica
    urlConsultaMedica?:string;
    urlGuardarDetalle?:string;
    urlListaDiagnostico?:string;
    urlListaServApoyo?:string;
    urlListaProcedimientos?:string;
    urlListaRecetas?:string;
    //profsiones
    urlProfessionalsSearch?:string;
    urlRegistrarProfesional?:string;
    urlGuardarPedido?: String;
    urlHLSeven?: string;
    urlListaHallazgo?:string;
    urlListaHallazgoOdontologico?:string;
    urlListaProcedimientoOdontologico?:string;
    urlListaDiagnosticoOdontologico?:string;
    urlListaSiglas?:string;
    urlConsultaMedicaUdontograma?:string;
}



export const MESSAGE_ROUTE: Array<IMessageRoute> = [
    {
        path: 'mensaje',
        data: {
            title: 'Título de mensaje',
            message: 'Texto de mensaje'
        }
    },
];

export const ERROR_ROUTE: Array<IMessageRoute> = [
    {
        path: 'error',
        data: {
            title: 'Error',
            message: 'Ocurrió un problema interno de la aplicación'
        }
    }
];

export const CRUMBS_LIST: Array<ICrumb> = [
    {
        parent: 'home',
        title: 'maintenance',
        description: 'Mantenimientos',
        href: 'maintenance',
        path: 2
    },
    {
        parent: 'home',
        title: 'medical-appointments',
        description: 'Consultas médicas',
        href: 'medical-appointments',
        path: 3
    },
    {
        parent: 'maintenance',
        title: 'professionals',
        description: 'Profesionales de la salud',
        href: 'professionals',
    },
    {
        parent: 'maintenance',
        title: 'professionals-detail',
        description: 'Detalle Profesional',
        href: 'professionals-detail',
        //path: 7
    },
    {
        parent: 'maintenance',
        title: 'new-profesional',
        description: 'Nuevo Profesional de la Salud',
        href: 'new-profesional',
        //path: 10
    },
    {
        parent: 'maintenance',
        title: 'edit-profesional',
        description: 'Editar Profesional de la Salud',
        href: 'edit-profesional',
        path: 0
    },
    {
        parent: 'home',
        title: 'detail',
        description: 'Detalle de Consulta',
        href: 'detail',
        path: 3
      },
    {
        parent: '',
        title: 'home',
        description: 'Gestión Médica',
        href: 'gestionmedica',
        path: 0
    },
    {
        parent: 'home',
        title: 'bandeja-historias',
        description: 'Bandeja de Historias Clínicas',
        href: 'bandeja-historias',
        path: 1
    },
    {
        parent: 'home',
        title: 'historial-documentos',
        description: 'Historial de carga de documentos',
        href: 'historial-documentos',
        path: 5
    },
    {
      parent: 'home',
      title: 'bandeja-documentos',
      description: 'Bandeja de documentos',
      href: 'bandeja-documentos',
      path: 20
    },
      {
          parent: 'historial-documentos',
          title: 'cargar-documentos',
          description: 'Carga de documentos',
          href: 'cargar-documentos',
          path: 30
        },
    {
        parent: 'historial-documentos',
        title: 'detalle-documentos',
        description: 'Detalle de documentos',
        href: 'detalle-documentos',
        path: 40
    },
    {
        parent: 'home',
        title: 'historial-clinico',
        description: 'Historias Clínicas',
        href: 'historial-clinico',
        path: 50
    },
    {
        parent: 'home',
        title: 'informes-proc-serv',
        description: 'Bandeja de Informes de Procedimientos y Servicios',
        href: 'informes-proc-serv',
        path: 60
    },
    {
        parent: 'informes-proc-serv',
        title: 'nuevo-informe',
        description: 'Nuevo informe de Procedimientos y Servicios',
        href: 'nuevo-informe',
        path: 65
    },
    {
        parent: 'informes-proc-serv',
        title: 'detalle-informe',
        description: 'Detalle de informe de Procedimientos y Servicios',
        href: 'detalle-informe',
        path: 68
    },
    {
        parent: 'home',
        title: 'bandeja-consultas',
        description: 'Bandeja de Consultas',
        href: 'bandeja-consultas',
        path: 70
    },
    {
        parent: 'home',
        title: 'bandeja-consultas',
        description: 'Bandeja de Consultas',
        href: 'bandeja-consultas',
        path: 80
    },
    {
        parent: 'home',
        title: 'mantenientos',
        description: 'Mantenimientos',
        href: 'mantenientos',
        path: 90
      }
];

export const ALERT_MESSAGES : Array<IAlerta> = [
    {
        title: 'Aviso',
        message: 'No se encontraron resultados para la búsqueda',
        type: 0
    },
    {
        title: '',
        message: '',
        type: 1
    },
    {
        title: 'Error',
        message: 'Hubo un error en su consulta, inténtelo nuevamente.',
        type: 2
    },
    {
        title: 'Éxito',
        message: 'La operación se ha realizado con éxito',
        type: 3
    },
    {
        title: 'Error',
        message: 'Error al acceder a GESTIÓN MÉDICA.',
        type: 4
    },

    {
        title: 'Error',
        message: 'No se encontró documento',
        type: 5
    },
    {
        title: 'Error',
        message: 'Error al firmar digitalmente. el documento OTP no es el esperado',
        type: 6
    },
    {
        title: 'Error',
        message: 'No se encontró número de consulta',
        type: 7
    },
    {
        title: 'Error',
        message: 'No se encontró orden de trabajo',
        type: 8
    },    
    {
        title: 'Error',
        message: 'No se encontró registros para ',
        type: 9
    },
    {
        title: 'Error',
        message: 'Por favor completar los campos',
        type: 10
    },
    {
        title: 'Error',
        message: 'Sólo los médicos pueden realizar una firma',
        type: 11
    },
    {
        title: 'Error',
        message: 'No tiene permiso para visualizar esta aplicación',
        type: 12
    },
    {
        title: 'Error',
        message: 'Su perfil no tiene disponible esta opción',
        type: 13
    },
    {
        title: 'Error',
        message: 'Debe ingresar un número de orden de atención antes de cargar documento',
        type: 14
    }
];

export const TYPE_LOGIN : any = {
    ejecutivo: {
      code: 1,
      subType: 1,
      type: 1,
      name: "Ejecutivo MAPFRE",
      description: "Ejecutivo MAPFRE",
      headerName: 'EJECUTIVO'
    },

    cliente: {
      code: 2,
      subType: 5,
      type: 2,
      name: "Cliente Persona",
      description: "Clientes",
      headerName: 'CLIENTE PERSONA'
    },

    proveedor: {
      code: 3,
      subType: 4,
      type: 3,
      name: "Proveedores",
      description: "Proveedores",
      headerName: 'PROVEEDOR'
    },

    broker: {
      code: 4,
      subType: 3,
      type: 3,
      name: "Brokers",
      description: "Brokers",
      headerName: 'BROKER'
    },

    empresa: {
      code: 5,
      subType: 2,
      type: 3,
      name: "Cliente Empresa",
      description: "Cliente Empresa",
      headerName: 'CLIENTE EMPRESA'
    }
}

export enum ALERT_TYPE {
    search = 1,
    custom = 2,
    error = 3,
    success = 4
};

export const CONTENT_TYPE: any = {
    excel : "application/vnd.ms-excel",
    excel_new: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pdf : "application/pdf",
    jpg : "image/jpeg",
    jpeg : "image/jpeg",
    png : "image/png",
    txt: "text/plain",
    zip : "application/zip",
    word: "application/msword",
    word_new: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
export const COMMON_TYPES: any = {
    medicos : 'medicos',
    medico: 'medico',
    documentosMedico: 'documentos del médico',
    estados: 'estados',
    beneficios: 'beneficios',
    procedimientos : 'procedimientos',
    diagnosticos : 'diagnosticos',
    documentos: 'documentos'
}
export const EXTENSION_FILES: any = {
    excel : ".xls",
    excel_new: ".xlsx",
    pdf : ".pdf",
    jpg : ".jpg",
    jpeg : ".jpeg",
    png : ".png",
    txt: "txt",
    zip : ".zip",
    word: "doc",
    word_new: "docx"
};

export const DOWNLOAD_CONFIG: any = {
    programa: {
        modulo: 1,
        accion: {
            busqueda: 10,
            detalle: 11,
            asegurados: 12,
            documento: 13
        }
    },
    asegurado: {
        modulo: 2,
        accion: {
            busqueda: 20,
            detalle: 21,
            excel: 22
        }
    },
    solicitud: {
        modulo: 3,
        accion: {
            documento: 30
        }
    }

}

export enum MODULES {
        programas = 'PROG',
        asegurados = 'ASEG',
        solicitudes = 'SOLMED',
        auditoria = 'AUTSOL'
}

export const ACCESS_CODE = {
    accesMaintenance: 'GM_MANTENIMIENTO',
    accesProfSalud: 'GM_PROF_SALUD'
};


export enum ODONTOGRAM_TYPE {
  DIAGNOSTICOS = 'Diagnosticos',
  HALLAZGOS = 'Hallazgos',
  PROCEDIMIENTOS = 'Procedimientos',
  TYPE = 'ODO'
};

export enum ESTADOS {
  atendido = 'ATENDIDO',
};
