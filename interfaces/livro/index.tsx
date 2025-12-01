import { Status } from "@/enums/status";
import { Genero } from "../genero";

export interface Livro{
    id:number,
    titulo:string,
    autor:string,
    publicacao:number,
    descricao:string,
    capa:string,
    dataCadastro:string,
    genero:Genero,
    status:Status
}