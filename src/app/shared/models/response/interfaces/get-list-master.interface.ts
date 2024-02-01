export interface IGetListMasterResponse{
    mensaje:string;
    operacion:number;
    numeroRegistros:number;
    numeroPaginas:number;
    data:ListMaster[]
}

interface ListMaster{
    codigo:string;
    descripcion:string;
}

