export interface IExcludeInsuredRequest {
    usuario: string;
	programas: IPrograma[];
}

interface IPrograma {
	codPrograma: string;
	codMotExclusion: string;
	desMotExclusion: string;
	fechaExclusion: string;
}