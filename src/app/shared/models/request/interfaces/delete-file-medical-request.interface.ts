import { IDocumento } from '@shared/models/common/interfaces/document.interface';

export interface IDeleteFileMedicalRequestRequest {
    documentos: IDocumento[];
}