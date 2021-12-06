export interface ICliente {
    codigoCliente: string;
    descCliente?: string;
    numCobertura: number;
    numDocumento?: string;
    tipDocumento?: string;
    bloqueado?: boolean;
}