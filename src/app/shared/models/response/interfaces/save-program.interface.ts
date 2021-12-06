import { IRespuesta } from '@shared/models/common/interfaces';

export interface ISaveProgramResponse {
    codRpta: number;
    msgRpta: string;
    data: IProgramaId;
}

interface IProgramaId {
    codigoPrograma: number;
}
