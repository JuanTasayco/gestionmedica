export interface IGetListProfessionalsResponse{
    mensaje:string;
    operacion:number;
    numeroRegistros:number;
    numeroPaginas:number;
    data:ListProfessionals[];
}

interface ListProfessionals{
    codigo:number;
    nombreApellido:string;
    tipoDocumento:string;
    numDocumento:string;
    fechNacimiento:string;
    genero:string;
    fila:number;
}