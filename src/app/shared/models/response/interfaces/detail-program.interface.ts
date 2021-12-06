import { IDiagnostico, ICobertura, IDocumento } from '@shared/models/common/interfaces';

export interface IDetailProgramResponse {
    codRpta: number;
    msgRpta: string;
    data: IDetallePrograma;
}

interface IDetallePrograma {
    icono: string;
    iconoBase64: string;
    numInscripto: number;
    paso: string;
    estado: string;
    descEstado: string;
    codigoCompania: number;
    codigoPrograma: number;
    nombrePrograma: string;
    codigoBeneficio: string;
    descBeneficio: string;
    fecInicioVigencia: string,
    fecFinVigencia: string;
    aplicaDeliveryMedicamentos: boolean;
    etiqueta: string;
    descripcion: string;
    caracteristica: string;
    objetivoGeneral: string;
    reqCobertura: boolean;
    reqDiagnostico: boolean;
    coberturas: ICobertura[];
    diagnosticos: IDiagnostico[];
    documentos: IDocumento[];
}