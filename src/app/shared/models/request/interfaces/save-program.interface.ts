export interface ISaveProgramRequest {
    compania: number;
    nombrePrograma: string;
    codigoBeneficio: string;
    aplicaDeliveryMedicamentos: boolean;
    fecInicioVigencia: string;
    fecFinVigencia: string;
    etiqueta: string;
    descripcion: string;
    caracteristica: string;
    objetivoGeneral: string;
    icono: string;
    iconoBase64: string;
}