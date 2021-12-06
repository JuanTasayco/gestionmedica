import { IAsegurado } from '@shared/models/common/interfaces';

export interface ISearchInsuredResponse {
    totalReg: string;
    totalPag: string;
    codRpta: number;
    msgRpta: string;
    data: IAsegurado[];
}