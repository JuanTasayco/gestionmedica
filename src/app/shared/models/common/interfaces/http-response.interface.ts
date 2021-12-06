import { IValueName } from '../interfaces/value-name.interface';

export interface IHttpResponse {
    code: string;
    message: string;
    data: IValueName[];
}