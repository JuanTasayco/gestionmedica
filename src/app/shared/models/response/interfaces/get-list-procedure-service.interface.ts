export interface IGetListProcedureServiceResponse {
        mensaje:      string;
        operacion:    number;
        totalPaginas: number;
        numeroRegistros : number;
        data:         IProcedureService[];
}

export interface IProcedureService {
    codigoProcedimientoServicio: string;
    descripcion:                 string;
    especialidad:                Diagnostico;
    sede:                        Diagnostico;
    registroClinico:             RegistroClinico;
    medico:                      Diagnostico;
    paciente:                    Paciente;
    diagnostico:                 Diagnostico;
}
    
interface Diagnostico {
    codigo:      string;
    descripcion: string;
}
    
interface Paciente {
    codigo:          number;
    tipoDocumento:   null;
    numeroDocumento: null;
    paciente:        string;
}
    
interface RegistroClinico {
    numeroConsulta:        number;
    numeroHistoriaClinica: number;
    numeroOrdenAtencion:   number;
}
    