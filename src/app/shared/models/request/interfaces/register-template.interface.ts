export interface IRegisterTemplateRequest {
    descripcion:          string;
    resumen:              string;
    contenido:            string;
    fechaRegistro:        string;
    estado:               string;
    usuarioRegistro:      string;
    usuarioActualizacion: string;
    tipoExamen:           {codigo: string;}
    clasificacion:        {codigo: string;}
    especialidad:         {codigo: number;}
    medico:               {codigo: number;}
    diagnostico:          {codigo: string;}
}