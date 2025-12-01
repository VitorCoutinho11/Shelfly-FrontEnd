import { Status } from "@/enums/status"
import { GeneroResponse } from "../genero/response"

export interface LivroResponse{
    id:number,
    titulo:string,
    autor:string,
    publicacao:number,
    descricao:string,
    capa:string,
    generoId:GeneroResponse,
    status:Status
    dataCadastro:string
}