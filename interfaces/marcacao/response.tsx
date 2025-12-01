import { Status } from "@/enums/status";
import { UsuarioLivroResponse } from "../usuarioLivro/response";

export interface MarcacaoResponse{
    id:number,
    pagina:number,
    anotacao:string,
    data:string,
    status:Status,
    usuarioLivro:UsuarioLivroResponse
}