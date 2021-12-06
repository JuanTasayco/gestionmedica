import { IRespuesta, IMaestro } from '@shared/models/common/interfaces';

export interface IListMaestroResponse {
    total_reg: string;
    total_pag: string;
    codRpta: number;
    msgRpta: string;
    data: IMaestro[];
}
