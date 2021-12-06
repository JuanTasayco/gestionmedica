import { IPrograma } from '../interfaces';

export class Programa implements IPrograma {
    codigoPrograma: number;
    nombrePrograma: string;
    fecInicioVigencia: string;
    fecFinVigencia: string;
    aplicaDeliveryMedicamentos: boolean;
    etiqueta: string;
    codigoBeneficio: string;
    estado: string;
    codigoCompania: number;
    numeroInscrito: number;
    icono: string;
    iconoBase64: string;
    paso: string;

    constructor() {
        this.estado = 'B';
        this.numeroInscrito = 0;
        this.paso = '';
    }
}