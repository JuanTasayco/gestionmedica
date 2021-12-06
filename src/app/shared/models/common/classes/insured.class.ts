import { IAsegurado } from '../interfaces';

export class Asegurado implements IAsegurado {
    fnac: string;
    score: number;
    vip: string;
    diagnosticos: any[];
    edad: number;
    productos: any[];
    codCompania: string;
    codAfiliado: string;
    nombre: string;
    apellidos?: string;
    tipDoc: string;
    numDoc: string;
    genero: string;
    preExistencias: string;
    estado: string;
    resumenPedidos: any[];
    indicadores: any;
    programas: any[];
    parentesco: string;
    nomCompania: string;
    mail: string;
    telefono: string;
    textProgramas: string;
    textProductos: string;
    color?: string;

    constructor() {
        this.score = 0;
        this.color = '#000000';
        this.indicadores = {
            estadoIMC: '',
            estadoPeso: '',
            estadoTalla: '',
            estadoPresionRtrialD: '',
            estadoPresionRtrialS: ''
        }
        this.diagnosticos = [];
        this.productos = [];
        this.programas = [];
        this.resumenPedidos = [
            {
                cantidadPedidos: 0,
                valorPedidos: 0
            },
            {
                cantidadPedidos: 0,
                valorPedidos: 0
            }
        ]
    }
}