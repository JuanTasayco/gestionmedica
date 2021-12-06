import { IMaestro } from '@shared/models/common/interfaces';

export interface IFilterClientResponse {
    total_reg: string;
    total_pag: string;
    codRpta: number;
    msgRpta: string;
    data: IMaestro[];
}