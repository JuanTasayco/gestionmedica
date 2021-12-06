import { ICliente } from './client.interface';

export interface ICobertura {
    selected?: boolean;
    numCobertura: number;
    codigoProducto: string;
    descProducto?: string;
    personalizadaPorCliente: boolean;
    clientes: ICliente[];
}