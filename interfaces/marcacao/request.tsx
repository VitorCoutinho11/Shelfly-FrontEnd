import { Status } from "@/enums/status";

export interface MarcacaoRequest{
    pagina:number,
    anotacao:string,
    usuarioLivroId:number,
    status:Status
}