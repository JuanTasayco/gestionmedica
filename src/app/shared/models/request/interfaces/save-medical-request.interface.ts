import { IMedicina, IDocumento } from '@shared/models/common/interfaces';

export interface ISaveMedicalRequestRequest {
    codigoCompania: string;
	codigoPrograma: string;
	codigoAfiliado: string;
	codigoDuracionReceta: string;
	tipDocumento: string;
	numDocumento: string;
	fecEntrega: string;
	codigoProvinciaEntrega: string;
	codigoDistritoEntrega: string;
	lugarAtencion: string;
	fecSolicitud: string;
	direccionEntrega: string;
	referencia: string;
	comentario: string;
	cobertura: string;
	fecAtencion: string;
	numeroSiteds: string;
	numeroPoliza: string;
	numeroContrato: string;
	codigoProducto: string;
	correo: string;
	telefono: string;
	telefono2?: string;
	medicamentos: IMedicina[];
	documentos: IDocumento[];
}