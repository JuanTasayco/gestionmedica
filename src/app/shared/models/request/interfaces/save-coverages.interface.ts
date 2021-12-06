import { ICobertura } from '@shared/models/common/interfaces';

export interface ISaveCoverageRequest {
    reqCobertura: boolean;
    coberturas: ICobertura[];
}