export interface IPedido {
    codigoPedido: number;
    descDistrito: string;
    descAfiiado: string;
    tipDocumento: string;
    numDocumento: string;
    lugarAtendido: string;
    descCliente: string;
    descDespacho: string;
    descEstado: string;
    estado?: number;
}