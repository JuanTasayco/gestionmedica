import { IComun } from "./comun.interface";

export interface IListComunReponse {
    mensaje: string;
    operacion: string;
    data: IComun[];
}
