import { IMaestro } from '@shared/models/common/interfaces';

export interface IListSitedsResponse {
    totalReg: string;
    totalPag: string;
    codRpta: number;
    msgRpta: string;
    data: IMaestro[];
}