export interface IGetListMedicalReportRequest {
    numeroPagina:       number;
    tamanioPagina:      number;
    pacienteDatos:      string;
    registroClinico:    string;
    codigoSede:         string;
    codigoEspecialidad: string;
    codigoMedico:       string;
    fechaRegistro:      FechaRegistro;
    estadoFirmado:      boolean;
}

export interface FechaRegistro {
    fechaInicio: string;
    fechaFin:    string;
}