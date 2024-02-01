 interface IDocumento {
    tipoDocumento: string;
    estado: string;
    fechaDocumento: string;
    fechaFirma: string;
    codigoItem: number;
    numeroItem: number;
    item: IDocumento;
}

export interface IDocumentosResult {
    numeroConsulta: number;
    estado: string;
    paciente: string;
    historiaClinica: number;
    sede: string;
    ocurencia: string;
    cantidadDocumento: number;
    compania: number;
    documentos: IDocumento[];
}

export interface IDetalleResult {
    tipoDocumento: string;
    fechaDocumento: string;
    fechaFirma?: string;
    estado: string;
    sede: string;
    historiaClinicaGlobal: number;
    historiaClinicaLocal: number;
    numeroDocumento: string;
    tipoItem: string;
    numeroConsulta: number;
    fechaConsulta: string;
    especialidad: string;
    medico: string;
    paciente: string;
    ordenAtencion: number;
    documentoBase64: string;
    beneficio: string;
}

export interface IHistoriaClinicaResult {
    historiaClinica: number;
    tipoDocumento: string;
    sede: string;
    medico: string;
    beneficio: string;
    numeroConsulta: number;
    paciente: string;
    especialidad: string;
    diagnostico: string;
    numeroDocumento: string;
    procedimiento: string;
    compania: number;
    codigoItem: number;
    numeroItem: number;
}
