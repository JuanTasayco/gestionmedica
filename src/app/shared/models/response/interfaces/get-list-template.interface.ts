export interface IGetListTemplateResponse{
    mensaje:      string;
    operacion:    number;
    totalPaginas: number;
    data:         Template[];
}

export interface Template {
    codigoPlantilla:      number;
    descripcionPlantilla: string;
    fila:                 number;
}