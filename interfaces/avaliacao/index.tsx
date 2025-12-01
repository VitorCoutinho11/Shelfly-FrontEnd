import { Status } from "@/enums/status";
import { Livro } from "../livro";
import { Usuario } from "../usuario";

export interface Avaliacao{
    id:number,
    nota:number,
    comentario:string,
    dataAvaliacao:string,
    usuario:Usuario,
    livro:Livro,
    status:Status
}