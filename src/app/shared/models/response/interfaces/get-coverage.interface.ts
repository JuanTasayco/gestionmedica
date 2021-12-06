export interface IGetCoverageResponse {
    data: ICoberturaSolicitud;
    codRpta: number;
    msgRpta: string;
}

export interface ICoberturaSolicitud {
    numeroContrato: number;
    numeroPoliza: number;
    descProducto: string;
    codigoProducto: string;
    numeroCobertura: number;
}