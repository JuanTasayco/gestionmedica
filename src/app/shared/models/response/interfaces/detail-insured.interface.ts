import { IAsegurado } from '@shared/models/common/interfaces';

export interface IDetailInsuredResponse {
    totalReg: string;
    totalPag: string;
    codRpta: number;
    msgRpta: string;
    data: IAsegurado[];
}