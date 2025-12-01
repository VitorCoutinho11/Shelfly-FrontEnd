import { Status } from "@/enums/status";

export interface Usuario{
    id:number,
    nome:string,
    email:string,
    senha:string,
    data:string,
    status:Status
}