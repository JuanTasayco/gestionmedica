export interface IMassiveAffiliateInsuredRequest {
	usuario: string;
	programas: IPrograma[];
	archivo: string;
}

interface IPrograma {
    codPrograma: string;
}