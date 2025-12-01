import { UsuarioLivroStatus } from "@/enums/usuariolivrostatus";

export interface UsuarioLivroRequest{
    status:UsuarioLivroStatus,
    nota:number,
    dataInicio:string,
    dataFim:string,
    paginaAtual:number,
    usuarioId:number,
    livroId:number
}