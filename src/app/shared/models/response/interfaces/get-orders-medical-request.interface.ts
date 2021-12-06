import { IPedido } from '@shared/models/common/interfaces';

export interface IGetOrderMedicalRequestResponse {
    totalReg: string;
    totalPag: string;
    totalEntregado: string;
    totalProgramado: string;
    codRpta: number;
    msgRpta: string;
    data: IPedido[];
}