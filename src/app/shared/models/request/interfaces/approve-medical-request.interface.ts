export interface IApproveMedicalRequestRequest {
    usuario: string;
    observacion: string;
	medicamentos: IMedicina[];
}

interface IMedicina {
    codigoMedicamento: string;
}