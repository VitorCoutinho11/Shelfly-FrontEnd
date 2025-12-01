import { UsuarioLivroStatus } from "@/enums/usuariolivrostatus";
import { Livro } from "../livro";
import { Usuario } from "../usuario";

export interface UsuarioLivro{
    id:number,
    status:UsuarioLivroStatus,
    nota:number,
    dataInicio:string,
    dataFim:string,
    paginaAtual:number,
    livro:Livro,
    usuario:Usuario
}