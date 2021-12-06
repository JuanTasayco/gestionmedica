import { IDiagnostico } from '@shared/models/common/interfaces';

export interface ISaveDiagnosticsRequest {
    reqDiagnostico: boolean;
    diagnosticos: IDiagnostico[];
}