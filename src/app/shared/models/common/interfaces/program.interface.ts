export interface IPrograma {
    codigoPrograma: number;
    nombrePrograma: string;
    fecInicioVigencia: string;
    fecFinVigencia: string;
    aplicaDeliveryMedicamentos: boolean;
    etiqueta: string;
    codigoBeneficio: string;
    estado: string;
    codigoCompania: number;
    coberturas?: IProducto[];
    productos?: string;
    descBeneficio?: string;
    descCompania?: string;
    numeroInscrito?: number;
    descEstado?: string;
    descripcion?: string;
    caracteristica?: string;
    objetivoGeneral?: string;
    icono: string;
    iconoBase64: string;
    fecActivo?: string;
    fecInactivo?: string;
    productosText?: string;
    paso: string;
}

interface IProducto {
    desProducto: string;
    compania: string;
    codigoProducto: string;
}