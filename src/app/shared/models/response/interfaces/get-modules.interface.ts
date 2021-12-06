export interface IGetModulesResponse {
    codRpta: number;
    msgRpta: string;
    data: IModulo[];
}

interface IModulo {
    nomCorto: string;
}