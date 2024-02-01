export interface IRegisterMedicalReportRequest {
    codigoPlantilla:      number;
    contenido:            string;
    fechaRegistro:        string;
    estado:               string;
    estadoFirmado:        boolean;
    fechaFirmado:         string;
    especialidad:         Especialidad;
    medico:               Medico;
    diagnostico:          Diagnostico;
    paciente:             Especialidad;
    registroClinico:      RegistroClinico;
    usuarioRegistro:      string;
    usuarioActualizacion: string;
    fechaEstadoRegistro:  string;
}

export interface Especialidad {
    codigo: number;
}

export interface Medico {
    codigo: number;
    nombre: string;
}

export interface Diagnostico{
    codigo: string;
    nombre:string;
}

export interface RegistroClinico {
    numeroConsulta:      number;
    numeroOrdenAtencion: number;
}
