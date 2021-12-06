export interface IAffiliateInsuredRequest {
    usuario: string;
    programas: IPrograma[];
}

interface IPrograma {
    codPrograma: string;
    poliza: string;
}