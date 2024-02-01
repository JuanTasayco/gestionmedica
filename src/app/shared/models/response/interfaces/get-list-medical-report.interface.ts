export interface IGetListMedicalReportResponse {
    mensaje:      string;
    operacion:    number;
    totalPaginas: number;
    numeroRegistros :number;
    data:         IMedicalReport[];
}

export interface IMedicalReport {
    codigoInformeMedico: number;
    fechaRegistro:       string;
    estado:              string;
    estadoFirmado:       boolean;
    especialidad:        Especialidad;
    sede:                Especialidad;
    medico:              Especialidad;
    paciente:            Paciente;
    registroClinico:     RegistroClinico;
    diasTranscurridos:   string;
    semaforo:            string;
    flagAnular:          string;
}

interface Especialidad {
    codigo:      string;
    descripcion: string;
}

interface Paciente {
    codigo:          number;
    tipoDocumento:   null;
    numeroDocumento: string;
    paciente:        string;
}

interface RegistroClinico {
    numeroConsulta:        number;
    numeroHistoriaClinica: number;
    numeroOrdenAtencion:   number;
}
