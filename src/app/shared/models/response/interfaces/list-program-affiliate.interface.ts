import { IProgramaAfiliado } from '@shared/models/common/interfaces';

export interface IListProgramByAffiliateResponse {
    codRpta: number;
    msgRpta: string;
    data: IProgramaAfiliado[];
}