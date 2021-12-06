import { IMaestro } from '@shared/models/common/interfaces';

export interface IFilterInsuredResponse {
    codRpta: number;
    msgRpta: string;
    totalReg: number;
    totalPag: number;
    data: IMaestro[];
}