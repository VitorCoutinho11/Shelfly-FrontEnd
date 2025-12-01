import { UsuarioLivroStatus } from "@/enums/usuariolivrostatus";
import { UsuarioResponse } from "../usuario/response";
import { LivroResponse } from "../livro/response";

export interface UsuarioLivroResponse{
    id:number,
    status:UsuarioLivroStatus,
    nota:number,
    dataInicio:string,
    dataFim:string,
    paginaAtual:number,
    usuario:UsuarioResponse,
    livro:LivroResponse
}