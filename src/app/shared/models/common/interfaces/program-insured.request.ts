export interface IProgramaAfiliado {
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
}