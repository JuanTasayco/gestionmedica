export interface IGetListSedeMasterResponse{
    mensaje:string;
    operacion:number;
    numeroRegistros:number;
    numeroPaginas:number;
    data:ListSedeMaster[]
}

interface ListSedeMaster{
    codigo:string;
    descripcion:string;
}