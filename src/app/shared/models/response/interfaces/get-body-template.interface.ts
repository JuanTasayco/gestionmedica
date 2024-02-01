export interface IGetBodyTemplateResponse {
    mensaje:   string;
    operacion: number;
    data:      BodyTemplate;
}

export interface BodyTemplate {
    contenido: string;
}