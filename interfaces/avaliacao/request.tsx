import { Status } from "@/enums/status";

export interface AvaliacaoRequest{
    nota:number,
    comentario:string,
    usuarioId:number,
    livroId:number,
    status:Status,
    dataAvaliacao:string
}