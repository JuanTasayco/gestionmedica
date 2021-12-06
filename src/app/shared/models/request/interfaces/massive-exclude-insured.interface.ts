export interface IMassiveExcludeInsuredRequest {
	usuario: string;
	programas: IPrograma[];
	archivo: string;
}

interface IPrograma {
    codPrograma: string;
}