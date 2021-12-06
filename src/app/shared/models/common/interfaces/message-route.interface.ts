export interface IMessageRoute {
    path: string,
    data: IData
}

interface IData {
    title: string;
    message: string;
}