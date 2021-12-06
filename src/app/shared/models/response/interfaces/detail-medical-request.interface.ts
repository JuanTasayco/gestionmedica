import { ISolicitudMedica } from '@shared/models/common/interfaces';

export interface IDetailMedicalRequestResponse {
    codRpta: number;
    msgRpta: string;
    data: ISolicitudMedica;
}