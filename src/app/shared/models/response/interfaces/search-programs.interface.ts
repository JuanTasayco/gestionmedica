import { IRespuesta, IPrograma } from '@shared/models/common/interfaces';

export interface ISearchProgramResponse {
    totalReg: string;
    totalPag: string;
    codRpta: number;
    msgRpta: string;
    data: IPrograma[];
}
