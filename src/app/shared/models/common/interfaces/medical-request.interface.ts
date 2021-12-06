import { IDocumento } from './document.interface';
import { IMedicina } from './medicine.interface';

export interface ISolicitudMedica {
    codigoSolicitud: number;
    estado: string;
    desEstado: string;
    codigoAfiliado: number
    desAfiliado: string;
    tipDocumento: string;
    numDocumento: string;
    codigoPrograma: number;
    desPrograma: string;
    fecAtencion: string;
    fecSolicitud: string;
    desDuracionReceta: string;
    descDuracionReceta? :string;
    fecEntrega: string;
    codigoCompania: number;
    desCompania: string;
    cobertura?: number;
    comentario?: string;
    direccionEntrega?: string;
    codigoDuracionReceta: number;
    codigoProvinciaEntrega: number;
    codigoDistritoEntrega: number;
    correo: string;
    telefono: string;
    telefono2?: string;
    desLugarAtencion?: string;
    desDistrito?: string;
    desProvincia?: string;
    referencia?: string;
    codigoSiteds?: string;
    numeroSiteds?: string;
    auditor?: string;
    lugarAtencion?: string;
    numeroPoliza?: string;
    numeroContrato?: string;
    codigoProducto?: string;
    descProducto?: string;
    medicamentos?: IMedicina[];
    documentos?: IDocumento[];
}