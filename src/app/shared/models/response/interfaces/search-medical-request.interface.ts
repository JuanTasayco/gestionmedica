import { ISolicitudMedica, IEstado } from '@shared/models/common/interfaces';

export interface ISearchMedicalRequestResponse {
    totalReg: string;
    totalPag: string;
    codRpta: number;
    msgRpta: string;
    data: ISolicitudMedica[];
    estados: IEstado[];
    estadoRpta: string;
}