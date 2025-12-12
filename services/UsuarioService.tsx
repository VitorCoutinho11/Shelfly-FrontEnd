import api from './api';
// Importe as interfaces sem o prefixo 'I'
import { UsuarioResponse } from '../interfaces/usuario/response'; 
import { UsuarioRequest } from '../interfaces/usuario/request'; 

const BASE_PATH = '/usuario'; 

export const UsuarioService = {
  
  /**
   * GET /api/usuario/listar
   * Espera uma LISTA (array) de UsuarioResponse
   * @returns Promise<UsuarioResponse[]>
   */
  listarTodos: async () => {
    // Tipando o retorno com UsuarioResponse[]
    const response = await api.get<UsuarioResponse[]>(`${BASE_PATH}/listar`); 
    return response.data;
  },

  /**
   * GET /api/usuario/listar/{usuarioId}
   * Espera um único UsuarioResponse
   * @param {number} usuarioId 
   * @returns Promise<UsuarioResponse>
   */
  listarPorId: async (usuarioId: number) => {
    const response = await api.get<UsuarioResponse>(`${BASE_PATH}/listar/${usuarioId}`);
    return response.data;
  },

  /**
   * POST /api/usuario/criar
   * @param {UsuarioDTORequest} dadosUsuario 
   * @returns Promise<UsuarioResponse>
   */
  criar: async (dadosUsuario: UsuarioRequest) => {
    const response = await api.post<UsuarioResponse>(`${BASE_PATH}/criar`, dadosUsuario);
    return response.data;
  },

  /**
   * PUT /api/usuario/atualizar/{usuarioId}
   * @param {number} usuarioId 
   * @param {UsuarioDTORequest} novosDados 
   * @returns Promise<UsuarioResponse>
   */
  atualizar: async (usuarioId: number, novosDados: UsuarioRequest) => {
    const response = await api.put<UsuarioResponse>(`${BASE_PATH}/atualizar/${usuarioId}`, novosDados);
    return response.data;
  },

  /**
   * DELETE /api/usuario/apagar/{usuarioId}
   * @param {number} usuarioId 
   * @returns Promise<void>
   */
  apagar: async (usuarioId: number) => {
    return api.delete(`${BASE_PATH}/apagar/${usuarioId}`);
  }
};