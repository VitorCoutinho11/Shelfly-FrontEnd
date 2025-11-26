import api from "./api"; // Importa a instância Axios configurada

// -----------------------------------------------------------
// 💡 TIPOS DE DADOS
// -----------------------------------------------------------

// Dados mínimos necessários para atualizar um perfil (Requisição - DTORequest)
export interface UsuarioDTORequest {
    nome?: string;
    email?: string;
    senha?: string;
    avatarUrl?: string; 
}

// Dados completos retornados pela API (Resposta - DTOResponse)
export interface UsuarioDTOResponse {
    id: number;
    nome: string;
    email: string;
    dataCadastro: string; 
    // Adicione qualquer outro campo que vem no DTO de Resposta (ex: lista de amigos, etc.)
}


// -----------------------------------------------------------
// 💡 FUNÇÕES DO SERVICE (Usando Axios)
// -----------------------------------------------------------

const BASE_PATH = '/usuarios'; // O Controller Spring usa @RequestMapping("/api/usuarios"), 
                              // mas como o apiClient já tem '/api' na baseURL, usamos só '/usuarios'

/**
 * Endpoint 1.0: Ver o perfil público de OUTRO usuário.
 * GET /api/usuarios/{usuarioId}
 * @param usuarioId O ID do usuário a ser buscado.
 * @returns Os dados públicos do usuário.
 */
export async function verPerfilPublico(usuarioId: number): Promise<UsuarioDTOResponse> {
    const endpoint = `${BASE_PATH}/${usuarioId}`;
    // Usamos .get<T>(endpoint) para tipar a resposta
    const response = await api.get<UsuarioDTOResponse>(endpoint); 
    return response.data; // O Axios retorna o payload dentro da propriedade 'data'
}

/**
 * Endpoint 1.1: ATUALIZAR O PRÓPRIO PERFIL.
 * PUT /api/usuarios/me
 * @param dados Os dados do perfil a serem atualizados.
 * @returns O perfil atualizado.
 */
export async function atualizarMeuPerfil(dados: UsuarioDTORequest): Promise<UsuarioDTOResponse> {
    const endpoint = `${BASE_PATH}/me`;
    // Usamos .put<T>(endpoint, body)
    const response = await api.put<UsuarioDTOResponse>(endpoint, dados);
    return response.data;
}

// -----------------------------------------------------------
// 💡 FUNÇÕES ADMIN 
// -----------------------------------------------------------

/**
 * Endpoint 2.0: LISTAR TODOS OS USUÁRIOS.
 * GET /api/usuarios
 * @returns Uma lista de todos os usuários.
 */
export async function listarTodosUsuarios(): Promise<UsuarioDTOResponse[]> {
    const endpoint = BASE_PATH;
    // Usamos .get<T[]>(endpoint)
    const response = await api.get<UsuarioDTOResponse[]>(endpoint);
    return response.data;
}

/**
 * Endpoint 2.1: ATUALIZAR UM USUÁRIO ESPECÍFICO POR ID (Uso Admin).
 * PUT /api/usuarios/{usuarioId}
 * @param usuarioId O ID do usuário a ser atualizado.
 * @param dados Os dados do usuário a serem atualizados.
 * @returns O perfil do usuário atualizado.
 */
export async function atualizarUsuario(usuarioId: number, dados: UsuarioDTORequest): Promise<UsuarioDTOResponse> {
    const endpoint = `${BASE_PATH}/${usuarioId}`;
    const response = await api.put<UsuarioDTOResponse>(endpoint, dados);
    return response.data;
}

/**
 * Endpoint 2.2: APAGAR UM USUÁRIO.
 * DELETE /api/usuarios/{usuarioId}
 * @param usuarioId O ID do usuário a ser apagado.
 * @returns Void (sem conteúdo de retorno).
 */
export async function apagarUsuario(usuarioId: number): Promise<void> {
    const endpoint = `${BASE_PATH}/${usuarioId}`;
    // Usamos .delete<void>(endpoint). O Axios não retorna 'data' para 204 No Content.
    await api.delete<void>(endpoint); 
}