import { Status } from "@/enums/status";
import { UsuarioResponse } from "../usuario/response";
import { LivroResponse } from "../livro/response";

export interface AvaliacaoResponse{
    id:number,
    nota:number,
    comentario:string,
    usuarioId:UsuarioResponse,
    livroId:LivroResponse,
    status:Status,
    dataAvaliacao:string
}