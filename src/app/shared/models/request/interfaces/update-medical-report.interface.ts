export interface IUpdateMedicalReportRequest {
    codigoPlantilla:      number;
    contenido:            string;
    fechaRegistro:        string;
    estado:               string;
    estadoFirmado:        boolean;
    fechaFirmado:         string;
    usuarioActualizacion: string;
    especialidad:         Especialidad;
    medico:               Especialidad;
    paciente:             Especialidad;
    diagnostico:          Diagnostico;
    registroClinico:      RegistroClinico;
}

interface Especialidad {
    codigo: number;
}

interface Diagnostico{
    codigo: string;
    nombre:string;
}

interface RegistroClinico {
    numeroConsulta:      number;
    numeroOrdenAtencion: number;
}
