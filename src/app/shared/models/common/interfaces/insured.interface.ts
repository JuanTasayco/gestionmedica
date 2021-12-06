export interface IAsegurado {
    fnac: string;
    score: number;
    vip: string;
    diagnosticos: IDiagnostico[];
    edad: number;
    productos?: IProducto[];
    codCompania: string;
    codAfiliado: string;
    nombre: string;
    apellidos?: string;
    tipDoc: string;
    numDoc: string;
    genero: string;
    preExistencias: string;
    estado: string;
    resumenPedidos: IPedido[];
    indicadores: IIndicador;
    programas: IPrograma[];
    parentesco: string;
    nomCompania: string;
    mail: string;
    telefono: string;
    textProgramas: string;
    textProductos: string;
    color? :string;
}

interface IDiagnostico {
    cantidad: number;
    descripcion: string;
    producto: string;
    sede: string;
    fechaU: string;
    centroAtencion: string;
    codAtencion: string;
    codCentroAtencion: string;
}

interface IProducto {
    codProducto: string;
    nomProducto: string;
}

interface IPedido {
    valorPedidos: number;
    cantidadPedidos: number;
    tipo: string;
}

interface IIndicador {
    imc: number;
    peso: string;
    talla: string;
    presionRtrialS: string;
    presionRtrialD: string;
    imcdesc: string;
    estadoIMC: string;
    estadoPresionRtrialS: string;
    estadoPresionRtrialD: string;
    estadoPeso: string;
    estadoTalla: string;
}

interface IPrograma {
    compania: number;
    programa: number;
    nombre: string;
    finalVigencia: string;
    estado: string;
    sugerido: boolean;
    motivo: string;
    icono: string;
    iconoBase64: string;
    listaPolizas: string[]
    selected?: boolean;
}