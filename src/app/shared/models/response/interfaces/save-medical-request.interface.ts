export interface ISaveMedicalRequestResponse {
    codRpta: number;
    msgRpta: string;
    data: ISolicitudId;
}

interface ISolicitudId {
    codigoSolicitud: number;
}