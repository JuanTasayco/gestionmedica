export interface IGetDetailMedicalReportResponse {
    mensaje:   string;
    operacion: number;
    data:      IDetailMedicalReport;
}

export interface IDetailMedicalReport {
    codigoInformeMedico: number;
    codigoPlantilla:     number;
    contenido:           string;
    fechaRegistro:       string;
    estado:              string;
    especialidad:        Especialidad;
    sede:                Especialidad;
    medico:              Especialidad;
    diagnostico:         Especialidad;
    paciente:            Paciente;
    registroClinico:     RegistroClinico;
}

export interface Especialidad {
    codigo:      string;
    descripcion: string;
}

export interface Paciente {
    codigo:          number;
    tipoDocumento:   null;
    numeroDocumento: null;
    paciente:        string;
}

export interface RegistroClinico {
    numeroConsulta:        number;
    numeroHistoriaClinica: number;
    numeroOrdenAtencion:   number;
}

