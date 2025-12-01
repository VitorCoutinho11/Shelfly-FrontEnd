import { Status } from "@/enums/status";

export interface LivroRequest{
    titulo:string,
    autor:string,
    publicacao:number,
    descricao:string,
    capa:string,
    generoId:number,
    status:Status
    dataCadastro:string
}