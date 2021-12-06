export interface ISearchInsuredRequest {
    CodCia?: string;
    CodPrd?: string;
    CodProg?: string;
    Candidatos?: number;
    TipDoc?: string;
    NumDoc?: string;
    NomPaciente?: string;
    Sexo?: string;
    EdadMin?: string;
    EdadMax?: string;
    p_size?: string;
    p_page?: string;
}