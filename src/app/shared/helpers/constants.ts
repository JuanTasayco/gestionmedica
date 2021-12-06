import { IMessageRoute, ICrumb, IAlerta } from '@shared/models/common/interfaces';

export const MIN_CHARACTERS_SEARCH = 3;

export const BASE_DATE_FORMAT = 'DD/MM/YYYY';
export const BASE_DATE_FORMAT_API = 'DD-MM-YYYY';

export const TIMER_REQUEST = 50000;

export const PATH_IP_SERVICE = 'https://api.ipify.org/?format=json';

export const PATH_SERVICE: BaseUrlConstants = {
    comun : 'comun/',
    perfil: 'perfil',
    documentosFiltro:'documento/filtro',
    correo: '/correo',
    descarga: 'descarga',
    detalle: '/detalle',
    documento: 'documento/',
    historiaClinicas: 'historiaClinica',
    firmar: '/firmar'
};

export const PATH_URL_DATA: BaseUrlConstants = {
    urlBandejaDocumento: 'bandeja-documentos',
    urlBandejaHistorias: 'bandeja-historias',
    urlDetalleDocumento: ':tipoModulo/detalle-documentos/:compania/:numeroConsulta/:codigoItem/:numeroItem',
    urlHistorialDocumento: 'historial-documentos',
    urlCargarDocumento : ':tipoModulo/cargar-documentos',
    urlMensaje: 'mensaje',
    ulrError: 'error',
    urlDefault: 'gestionmedica',
    urlDefault2: '**'
};

export class BaseUrlConstants{
    comun?: string;
    perfil?: string;
    documentosFiltro?: string;
    correo?: string;
    descarga?: string;
    detalle?: string;
    documento?: string;
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
        parent: '',
        title: 'home',
        description: 'Gestión Médica',
        href: '',
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
      }
];

export const ALERT_MESSAGES : Array<IAlerta> = [
    {
        title: 'Aviso',
        message: 'No se encontraron resultados para la búsqueda',
        type: 1
    },
    {
        title: '',
        message: '',
        type: 2
    },
    {
        title: 'Error',
        message: 'Hubo un error en su consulta, inténtelo nuevamente.',
        type: 3
    },
    {
        title: 'Éxito',
        message: 'La operación se ha realizado con éxito',
        type: 4
    },
    {
        title: 'Error',
        message: 'Error al acceder a GESTIÓN MÉDICA.',
        type: 5
    },
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
