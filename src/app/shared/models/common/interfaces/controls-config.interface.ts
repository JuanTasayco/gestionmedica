import { IControlValidation } from './control-validation.interface';

export interface ICSearchInsured {
  num_documento: IControlValidation
}

export interface ICEditImc {
  talla: IControlValidation,
  peso: IControlValidation,
  distolica: IControlValidation,
  sistolica: IControlValidation 
}

export interface ICRequest {
  cobertura: IControlValidation,
  correo: IControlValidation,
  telefono: IControlValidation,
  direccion: IControlValidation,
  referencia: IControlValidation,
  comentarios: IControlValidation
}

export interface ICProgramHeader {
  nombre: IControlValidation,
  descripcion: IControlValidation,
  objetivo: IControlValidation,
  caracteristicas: IControlValidation,
  etiquetas: IControlValidation
}