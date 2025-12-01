import { Status } from "@/enums/status";

export interface Marcacao{
    id:number,
    pagina:number,
    anotacao:String,
    data:string,
    status:Status,
    usuarioLivroId:number
}