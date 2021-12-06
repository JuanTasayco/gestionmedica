export class SolicitudMedica {
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
    fecEntrega: string;
    codigoCompania: number;
    desCompania: string;
    cobertura?: number;
    comentario?: string;
    direccionEntrega?: string;
    codigoDuracionReceta: number;
    codigoDistritoEntrega: number;
    codigoProvinciaEntrega: number;
    correo: string;
    telefono: string;
    referencia?: string;
    medicamentos?: any[];
    documentos?: any[];

    constructor() {
        this.codigoSolicitud = 0;
        this.estado = '';
        this.desEstado = '';
        this.codigoAfiliado = 0;
        this.desAfiliado = '';
        this.tipDocumento = '';
        this.numDocumento = '';
        this.codigoPrograma = 0;
        this.desPrograma = '';
        this.fecSolicitud = '';
        this.desDuracionReceta = '';
        this.fecEntrega = '';
        this.codigoCompania = 0;
        this.desCompania = '';
    }
}