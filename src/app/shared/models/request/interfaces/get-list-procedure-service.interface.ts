export interface IGetListProcedureServiceRequest {
    numeroPagina:                number;
    tamanioPagina:               number;
    pacienteDatos:               string;
    registroClinico:             string;
    codigoProcedimientoServicio: string;
    codigoSede:                  string;
    codigoEspecialidad:          string;
    codigoMedico:                string;
    fechaRegistro:               FechaRegistro;
}

interface FechaRegistro {
    fechaInicio: string;
    fechaFin:    string;
}